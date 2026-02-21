/**
 * process-render-queue — Supabase Edge Function
 * 
 * Picks up the next pending render job from the queue and processes it.
 * Designed to be called by a cron job (Supabase pg_cron) or manually.
 * 
 * Flow:
 *   1. SELECT the oldest pending job
 *   2. Mark it as 'rendering'
 *   3. Invoke Remotion Lambda (or local CLI in dev)
 *   4. Upload result to Supabase Storage
 *   5. Update job with output_url and 'complete' status
 * 
 * Environment variables required:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - REMOTION_AWS_REGION (optional, for Lambda)
 *   - REMOTION_FUNCTION_NAME (optional, for Lambda)
 *   - REMOTION_SERVE_URL (optional, for Lambda)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for invocation
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RenderJob {
    id: string;
    car_id: string;
    render_type: string;
    status: string;
    attempt: number;
    max_retries: number;
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, serviceRoleKey);

        // 1. Pick the next pending job (FIFO with priority)
        const { data: job, error: fetchError } = await supabase
            .from('render_queue')
            .select('*')
            .eq('status', 'pending')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        if (fetchError || !job) {
            return new Response(
                JSON.stringify({ message: 'No pending jobs', queue_empty: true }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            );
        }

        const renderJob = job as RenderJob;

        // 2. Mark as rendering
        await supabase
            .from('render_queue')
            .update({
                status: 'rendering',
                started_at: new Date().toISOString(),
                attempt: renderJob.attempt + 1,
            })
            .eq('id', renderJob.id);

        // 3. Fetch car data for the render
        const { data: car, error: carError } = await supabase
            .from('cars')
            .select(`
        id, name, brand, model, price, location,
        transmission, fuel, engine_cc, capacity,
        image_urls, description, features,
        profiles:host_id (name, is_verified),
        car_ratings (avg_rating, review_count)
      `)
            .eq('id', renderJob.car_id)
            .single();

        if (carError || !car) {
            await supabase
                .from('render_queue')
                .update({
                    status: 'failed',
                    error: `Car not found: ${renderJob.car_id}`,
                    completed_at: new Date().toISOString(),
                })
                .eq('id', renderJob.id);

            return new Response(
                JSON.stringify({ error: 'Car not found', job_id: renderJob.id }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            );
        }

        // 4. Determine render configuration
        const renderConfig = getRenderConfig(renderJob.render_type);
        console.log(`[Render] Picked config for ${renderJob.render_type}:`, renderConfig.compositionId);

        // 5. Attempt render
        //    In production: invoke Remotion Lambda
        //    In development: placeholder that marks as complete with a dummy URL
        const isProduction = Deno.env.get('REMOTION_FUNCTION_NAME') !== undefined;

        let outputUrl: string;

        if (isProduction) {
            // ───── PRODUCTION: Remotion Lambda ─────
            // This is a placeholder for the actual Lambda invocation.
            // When Remotion Lambda is deployed, replace this block with:
            //
            // import { renderMediaOnLambda } from '@remotion/lambda';
            // const result = await renderMediaOnLambda({
            //   region: Deno.env.get('REMOTION_AWS_REGION'),
            //   functionName: Deno.env.get('REMOTION_FUNCTION_NAME'),
            //   serveUrl: Deno.env.get('REMOTION_SERVE_URL'),
            //   composition: renderConfig.compositionId,
            //   inputProps: { car: formatCar(car) },
            //   codec: 'h264',
            //   imageFormat: 'jpeg',
            // });
            // outputUrl = result.outputFile;

            throw new Error('Remotion Lambda not yet configured. Set REMOTION_FUNCTION_NAME env var.');
        } else {
            // ───── DEVELOPMENT: Store placeholder ─────
            // In dev mode, mark as complete with a placeholder URL.
            // This allows testing the full pipeline flow without Lambda.
            outputUrl = `${supabaseUrl}/storage/v1/object/public/marketing-assets/${renderJob.car_id}/${renderJob.render_type}.mp4`;
        }

        // 6. Upload to storage (when using Lambda, the result is already a URL)
        // For now, we just store the URL reference

        // 7. Mark as complete
        await supabase
            .from('render_queue')
            .update({
                status: 'complete',
                output_url: outputUrl,
                completed_at: new Date().toISOString(),
            })
            .eq('id', renderJob.id);

        return new Response(
            JSON.stringify({
                success: true,
                job_id: renderJob.id,
                car_id: renderJob.car_id,
                render_type: renderJob.render_type,
                output_url: outputUrl,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error('Render queue processing error:', error);

        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
    }
});

/**
 * Get the render configuration for a given render type.
 */
function getRenderConfig(renderType: string) {
    switch (renderType) {
        case 'showcase':
            return {
                compositionId: 'CarShowcase',
                width: 1920,
                height: 1080,
                fps: 30,
                durationSec: 15,
            };
        case 'og_video':
            return {
                compositionId: 'OGVideo',
                width: 1200,
                height: 630,
                fps: 30,
                durationSec: 6,
            };
        case 'reel':
            return {
                compositionId: 'SocialReel',
                width: 1080,
                height: 1920,
                fps: 30,
                durationSec: 12,
            };
        case 'ad':
            return {
                compositionId: 'AdPipeline',
                width: 1920,
                height: 1080,
                fps: 30,
                durationSec: 20,
            };
        case 'onboarding':
            return {
                compositionId: 'HostOnboarding',
                width: 1920,
                height: 1080,
                fps: 30,
                durationSec: 18,
            };
        case 'hero':
            return {
                compositionId: 'HeroVideo',
                width: 1080,
                height: 1080,
                fps: 30,
                durationSec: 20,
            };
        default:
            return {
                compositionId: 'CarShowcase',
                width: 1920,
                height: 1080,
                fps: 30,
                durationSec: 15,
            };
    }
}
