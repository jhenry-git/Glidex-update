/**
 * Render Queue API — Client-side service for polling render status
 * and displaying pre-rendered videos when available.
 */

import { supabase } from '@/lib/supabase';

export type RenderType = 'reel' | 'og_video' | 'showcase' | 'hero';
export type RenderStatus = 'pending' | 'rendering' | 'complete' | 'failed';

export interface RenderJob {
    id: string;
    car_id: string;
    render_type: RenderType;
    status: RenderStatus;
    output_url: string | null;
    error: string | null;
    created_at: string;
    completed_at: string | null;
}

/**
 * Get the rendered video URL for a specific car and render type.
 * Returns the URL if the render is complete, null otherwise.
 */
export async function getRenderedVideoUrl(
    carId: string,
    renderType: RenderType = 'showcase'
): Promise<string | null> {
    const { data, error } = await supabase
        .from('render_queue')
        .select('output_url, status')
        .eq('car_id', carId)
        .eq('render_type', renderType)
        .eq('status', 'complete')
        .single();

    if (error || !data) return null;
    return data.output_url;
}

/**
 * Get all render jobs for a car (for admin/debug views).
 */
export async function getRenderJobs(carId: string): Promise<RenderJob[]> {
    const { data, error } = await supabase
        .from('render_queue')
        .select('*')
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

/**
 * Check if a pre-rendered video exists for a car.
 * Used to decide whether to show the static Remotion Player
 * or a pre-rendered MP4 video.
 */
export async function getCarMediaAssets(carId: string): Promise<{
    showcaseUrl: string | null;
    ogVideoUrl: string | null;
    reelUrl: string | null;
}> {
    const { data, error } = await supabase
        .from('render_queue')
        .select('render_type, output_url, status')
        .eq('car_id', carId)
        .eq('status', 'complete');

    if (error || !data) {
        return { showcaseUrl: null, ogVideoUrl: null, reelUrl: null };
    }

    const findUrl = (type: RenderType) =>
        data.find((r) => r.render_type === type)?.output_url ?? null;

    return {
        showcaseUrl: findUrl('showcase'),
        ogVideoUrl: findUrl('og_video'),
        reelUrl: findUrl('reel'),
    };
}
