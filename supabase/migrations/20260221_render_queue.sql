-- ============================================================
-- GlideX Render Queue — Migration Script
-- 
-- Creates the render_queue table for managing async Remotion
-- Lambda renders. Each row represents a render job that moves
-- through: pending → rendering → complete / failed
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Render types enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'render_type') THEN
        CREATE TYPE render_type AS ENUM ('reel', 'og_video', 'showcase', 'hero');
    END IF;
END$$;

-- Render status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'render_status') THEN
        CREATE TYPE render_status AS ENUM ('pending', 'rendering', 'complete', 'failed');
    END IF;
END$$;

-- Main render queue table
CREATE TABLE IF NOT EXISTS render_queue (
    id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    car_id      UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    render_type render_type NOT NULL DEFAULT 'showcase',
    status      render_status NOT NULL DEFAULT 'pending',
    
    -- Render output
    output_url  TEXT,           -- Final CDN/Storage URL of rendered video
    error       TEXT,           -- Error message if failed
    
    -- Metadata
    priority    INTEGER NOT NULL DEFAULT 0,  -- Higher = processed first
    attempt     INTEGER NOT NULL DEFAULT 0,  -- Retry count
    max_retries INTEGER NOT NULL DEFAULT 3,
    
    -- Timestamps
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    started_at  TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Deduplication: only one active render per car + type
    UNIQUE (car_id, render_type, status)
);

-- Index for worker polling (pending jobs, oldest first)
CREATE INDEX IF NOT EXISTS idx_render_queue_pending 
    ON render_queue (status, priority DESC, created_at ASC) 
    WHERE status = 'pending';

-- Index for car lookups (e.g., "get all renders for this car")
CREATE INDEX IF NOT EXISTS idx_render_queue_car_id 
    ON render_queue (car_id);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE render_queue ENABLE ROW LEVEL SECURITY;

-- Anyone can read render queue status (needed for web client to poll)
CREATE POLICY "anon_read_render_queue" ON render_queue
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only service_role can insert/update (Edge Functions use service_role)
CREATE POLICY "service_insert_render_queue" ON render_queue
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "service_update_render_queue" ON render_queue
    FOR UPDATE
    TO service_role
    USING (true);

-- ============================================================
-- Auto-trigger: enqueue renders when a car is created
-- ============================================================

CREATE OR REPLACE FUNCTION fn_enqueue_car_renders()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-enqueue a showcase render for every new car
    INSERT INTO render_queue (car_id, render_type, status, priority)
    VALUES (NEW.id, 'showcase', 'pending', 0);
    
    -- Auto-enqueue an OG video render
    INSERT INTO render_queue (car_id, render_type, status, priority)
    VALUES (NEW.id, 'og_video', 'pending', 0);
    
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    -- Already queued, skip silently
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on car creation
DROP TRIGGER IF EXISTS trg_enqueue_car_renders ON cars;
CREATE TRIGGER trg_enqueue_car_renders
    AFTER INSERT ON cars
    FOR EACH ROW
    EXECUTE FUNCTION fn_enqueue_car_renders();

-- ============================================================
-- Re-render trigger: enqueue when car images are updated
-- ============================================================

CREATE OR REPLACE FUNCTION fn_requeue_on_image_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only re-render if image_urls actually changed
    IF OLD.image_urls IS DISTINCT FROM NEW.image_urls THEN
        -- Mark existing renders as pending (reset)
        UPDATE render_queue 
        SET status = 'pending', 
            attempt = 0, 
            error = NULL, 
            output_url = NULL,
            started_at = NULL,
            completed_at = NULL
        WHERE car_id = NEW.id 
          AND status IN ('complete', 'failed');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_requeue_on_image_change ON cars;
CREATE TRIGGER trg_requeue_on_image_change
    AFTER UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION fn_requeue_on_image_change();
