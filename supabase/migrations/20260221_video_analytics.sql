-- ============================================================
-- GlideX Video Analytics — Migration Script
--
-- Tracks video engagement events for growth analytics:
-- view starts, completions, CTA clicks, shares
-- ============================================================

CREATE TABLE IF NOT EXISTS video_analytics (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type      TEXT NOT NULL,
    car_id          UUID REFERENCES cars(id) ON DELETE SET NULL,
    video_type      TEXT NOT NULL,          -- hero, showcase, social_reel, ad, onboarding
    source          TEXT NOT NULL,          -- player (Remotion), prerendered (MP4)
    page            TEXT NOT NULL,          -- URL path where event occurred
    duration_ms     INTEGER,               -- Time spent watching (ms)
    progress_pct    INTEGER,               -- % of video watched
    metadata        JSONB,                 -- Flexible extra data (cta_target, share_method, etc.)
    user_agent      TEXT,
    viewport_width  INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Anyone can insert (analytics are fire-and-forget)
ALTER TABLE video_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_analytics" ON video_analytics
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only service_role can read (for dashboards / reporting)
CREATE POLICY "service_read_analytics" ON video_analytics
    FOR SELECT
    TO service_role
    USING (true);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_analytics_car_id
    ON video_analytics (car_id);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type
    ON video_analytics (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_video_type
    ON video_analytics (video_type, created_at DESC);
