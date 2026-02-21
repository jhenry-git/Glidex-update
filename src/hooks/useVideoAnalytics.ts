/**
 * useVideoAnalytics — Track video engagement and render pipeline metrics.
 *
 * Logs events to Supabase for:
 * - Video views (play started)
 * - View duration / completion rate
 * - CTA clicks from video sections
 * - Render job performance (time to render)
 */

import { useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// === Types ===

export type VideoEventType =
    | 'view_start'
    | 'view_complete'
    | 'view_progress'
    | 'cta_click'
    | 'share'
    | 'render_complete';

export interface VideoEvent {
    event_type: VideoEventType;
    car_id?: string;
    video_type: 'hero' | 'showcase' | 'social_reel' | 'ad' | 'onboarding';
    source: 'player' | 'prerendered';
    page: string;
    duration_ms?: number;
    progress_pct?: number;
    metadata?: Record<string, unknown>;
}

// === Analytics API ===

/**
 * Log a video analytics event to Supabase.
 * Non-blocking — errors are silently swallowed so they don't affect UX.
 */
async function logVideoEvent(event: VideoEvent): Promise<void> {
    try {
        await supabase.from('video_analytics').insert({
            event_type: event.event_type,
            car_id: event.car_id ?? null,
            video_type: event.video_type,
            source: event.source,
            page: event.page,
            duration_ms: event.duration_ms ?? null,
            progress_pct: event.progress_pct ?? null,
            metadata: event.metadata ?? null,
            created_at: new Date().toISOString(),
            // User agent for device segmentation
            user_agent: navigator.userAgent,
            viewport_width: window.innerWidth,
        });
    } catch {
        // Silent fail — analytics should never break the app
    }
}

// === Hook ===

interface UseVideoAnalyticsOptions {
    carId?: string;
    videoType: VideoEvent['video_type'];
    source: VideoEvent['source'];
    page: string;
}

/**
 * React hook for tracking video engagement.
 *
 * Returns event handlers to attach to video elements or Remotion Players.
 */
export function useVideoAnalytics(options: UseVideoAnalyticsOptions) {
    const { carId, videoType, source, page } = options;
    const viewStartTime = useRef<number | null>(null);
    const hasLoggedStart = useRef(false);

    // Log view start (once per mount)
    const trackViewStart = useCallback(() => {
        if (hasLoggedStart.current) return;
        hasLoggedStart.current = true;
        viewStartTime.current = Date.now();
        logVideoEvent({
            event_type: 'view_start',
            car_id: carId,
            video_type: videoType,
            source,
            page,
        });
    }, [carId, videoType, source, page]);

    // Log view completion
    const trackViewComplete = useCallback(() => {
        const durationMs = viewStartTime.current
            ? Date.now() - viewStartTime.current
            : undefined;
        logVideoEvent({
            event_type: 'view_complete',
            car_id: carId,
            video_type: videoType,
            source,
            page,
            duration_ms: durationMs,
            progress_pct: 100,
        });
    }, [carId, videoType, source, page]);

    // Log progress checkpoint (e.g., 25%, 50%, 75%)
    const trackProgress = useCallback(
        (progressPct: number) => {
            logVideoEvent({
                event_type: 'view_progress',
                car_id: carId,
                video_type: videoType,
                source,
                page,
                progress_pct: progressPct,
            });
        },
        [carId, videoType, source, page]
    );

    // Log CTA click
    const trackCtaClick = useCallback(
        (ctaTarget?: string) => {
            logVideoEvent({
                event_type: 'cta_click',
                car_id: carId,
                video_type: videoType,
                source,
                page,
                metadata: ctaTarget ? { cta_target: ctaTarget } : undefined,
            });
        },
        [carId, videoType, source, page]
    );

    // Log share action
    const trackShare = useCallback(
        (shareMethod?: string) => {
            logVideoEvent({
                event_type: 'share',
                car_id: carId,
                video_type: videoType,
                source,
                page,
                metadata: shareMethod ? { share_method: shareMethod } : undefined,
            });
        },
        [carId, videoType, source, page]
    );

    // Reset on unmount
    useEffect(() => {
        return () => {
            hasLoggedStart.current = false;
            viewStartTime.current = null;
        };
    }, []);

    return {
        trackViewStart,
        trackViewComplete,
        trackProgress,
        trackCtaClick,
        trackShare,
    };
}

// === SQL Migration for video_analytics table ===
// (Run this in Supabase SQL Editor)
//
// CREATE TABLE IF NOT EXISTS video_analytics (
//     id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//     event_type  TEXT NOT NULL,
//     car_id      UUID REFERENCES cars(id) ON DELETE SET NULL,
//     video_type  TEXT NOT NULL,
//     source      TEXT NOT NULL,
//     page        TEXT NOT NULL,
//     duration_ms INTEGER,
//     progress_pct INTEGER,
//     metadata    JSONB,
//     user_agent  TEXT,
//     viewport_width INTEGER,
//     created_at  TIMESTAMPTZ DEFAULT NOW()
// );
//
// ALTER TABLE video_analytics ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "anon_insert_analytics" ON video_analytics
//     FOR INSERT TO anon, authenticated WITH CHECK (true);
//
// CREATE POLICY "service_read_analytics" ON video_analytics
//     FOR SELECT TO service_role USING (true);
//
// CREATE INDEX idx_analytics_car_id ON video_analytics (car_id);
// CREATE INDEX idx_analytics_event_type ON video_analytics (event_type, created_at);
