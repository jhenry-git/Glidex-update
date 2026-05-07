import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const RENDERS_DIR = path.join(PUBLIC_DIR, 'renders');

// Ensure renders directory exists
if (!fs.existsSync(RENDERS_DIR)) {
    fs.mkdirSync(RENDERS_DIR, { recursive: true });
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve pre-rendered videos as static files with correct MIME type
app.use('/renders', express.static(RENDERS_DIR, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Accept-Ranges', 'bytes');
        }
    },
}));

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// Use Service Role key if available, otherwise fallback to Anon key.
// Ensure VITE_SUPABASE_SERVICE_ROLE_KEY is in your .env
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Let's bundle the Remotion project once on startup or per-request if we want hot reloading
// For local execution, bundling per request is fine but slow. Let's create a bundled cache.
let bundledUrl = '';

async function getBundledUrl() {
    if (bundledUrl) return bundledUrl;
    console.log('Bundling Remotion project...');
    bundledUrl = await bundle({
        entryPoint: path.resolve(__dirname, '../remotion/index.ts'),
        webpackOverride: (config) => config,
    });
    console.log('Bundled project successfully:', bundledUrl);
    return bundledUrl;
}

// Ensure bundle is ready
getBundledUrl().catch(console.error);


// Configuration mappings (mirroring edge function)
function getRenderConfig(renderType) {
    switch (renderType) {
        case 'showcase':
            return { compositionId: 'CarShowcase' };
        case 'og_video':
            return { compositionId: 'OGVideo' };
        case 'reel':
            return { compositionId: 'SocialReel' };
        case 'ad':
            return { compositionId: 'AdPipeline' };
        case 'onboarding':
            return { compositionId: 'HostOnboarding' };
        case 'hero':
            return { compositionId: 'HeroVideo' };
        default:
            return { compositionId: 'CarShowcase' };
    }
}


app.post('/api/render-car-video', async (req, res) => {
    const { carId, renderType = 'showcase' } = req.body;

    if (!carId) {
        return res.status(400).json({ error: 'carId is required' });
    }

    try {
        // 1. Mark as pending/rendering in DB to avoid collisions
        // First, check if there's already a complete one
        const { data: existingJob, error: searchError } = await supabase
            .from('render_queue')
            .select('*')
            .eq('car_id', carId)
            .eq('render_type', renderType)
            .eq('status', 'complete')
            .single();

        // For local dev/demo, we might just re-render to allow updates, 
        // but typically we'd return the existing one if it exists.

        const jobId = Math.random().toString(36).substring(7); // fake job ID for local local DB sync if needed

        // Generate an ID for the DB
        const { data: insertData, error: insertError } = await supabase
            .from('render_queue')
            .insert({
                car_id: carId,
                render_type: renderType,
                status: 'rendering',
                output_url: null
            })
            .select('id')
            .single();

        const actualJobId = insertData?.id || jobId;

        // 2. Fetch Car Data
        console.log(`[DB] Fetching car data for ID: ${carId}`);
        const carQuery = await supabase
            .from('cars')
            .select(`
        id, name, brand, model, price, location,
        transmission, fuel, engine_cc, capacity,
        image_urls, description, host_id
      `)
            .eq('id', carId)
            .limit(1);

        const carError = carQuery.error;
        const car = carQuery.data && carQuery.data.length > 0 ? carQuery.data[0] : null;

        console.log(`[DB] Query result:`, { carFound: !!car, error: carError, data: carQuery.data });

        if (carError || !car) {
            console.error("Car not found", carId, carError);
            // Update DB if possible
            return res.status(404).json({ error: 'Car not found', dbError: carError, dbData: carQuery.data });
        }

        // Format the car for the composition
        const formattedCar = {
            id: car.id,
            name: car.name,
            brand: car.brand,
            model: car.model,
            price: car.price,
            location: car.location,
            transmission: car.transmission,
            fuel: car.fuel,
            engine_cc: car.engine_cc,
            capacity: car.capacity,
            image_urls: car.image_urls || [],
            is_available: true,
            host_id: car.profiles?.id || 'host',
            created_at: new Date().toISOString(),
            description: car.description || '',
            features: [], // Field omitted from DB, using fallback array
            hostName: car.profiles?.name || 'Trusted Host',
            hostEmail: '',
            hostPhone: '',
            isVerified: car.profiles?.is_verified || false,
            isNew: false,
            rating: car.car_ratings?.[0]?.avg_rating || 5.0,
            reviews: car.car_ratings?.[0]?.review_count || 0,
        };

        const serveUrl = await getBundledUrl();

        const config = getRenderConfig(renderType);
        const compositionId = config.compositionId;

        console.log(`Selecting composition ${compositionId}...`);
        const composition = await selectComposition({
            serveUrl,
            id: compositionId,
            inputProps: { car: formattedCar },
        });

        const outputFilename = `car-${carId}-${Date.now()}.mp4`;
        const outputPath = path.join(RENDERS_DIR, outputFilename);

        console.log(`Starting render for ${carId} to ${outputPath}...`);

        await renderMedia({
            composition,
            serveUrl,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps: { car: formattedCar },
            // ── QuickTime + social media compatibility ──
            // yuv420p is required for QuickTime Player, Instagram, TikTok, WhatsApp
            pixelFormat: 'yuv420p',
            // CRF 18 = visually lossless, fast encode, small-ish file
            crf: 18,
            onProgress: ({ progress }) => {
                console.log(`Rendering progress: ${Math.floor(progress * 100)}%`);
            },
        });

        // Post-process: apply faststart for streaming/social media compatibility
        // Remotion doesn't natively support -movflags +faststart, so we re-mux
        const tempPath = outputPath + '.tmp.mp4';
        try {
            await new Promise((resolve, reject) => {
                execFile('ffmpeg', [
                    '-i', outputPath,
                    '-c', 'copy',           // no re-encode, just re-mux
                    '-movflags', '+faststart',
                    '-y',
                    tempPath,
                ], (error, stdout, stderr) => {
                    if (error) {
                        console.warn('faststart remux failed (non-critical):', error.message);
                        // Clean up temp if it exists
                        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                        resolve(); // Continue with original file
                    } else {
                        // Replace original with faststart version
                        fs.renameSync(tempPath, outputPath);
                        console.log('Applied faststart moov atom successfully');
                        resolve();
                    }
                });
            });
        } catch (e) {
            console.warn('faststart post-process skipped:', e.message);
        }

        console.log(`Render complete! File saved at ${outputPath}`);

        const outputUrl = `/renders/${outputFilename}`;

        // 3. Mark complete in DB
        if (insertData?.id) {
            await supabase
                .from('render_queue')
                .update({
                    status: 'complete',
                    output_url: outputUrl,
                    completed_at: new Date().toISOString()
                })
                .eq('id', insertData.id);
        }

        // Include the full URL if we're sending it back directly (assuming same origin)
        return res.json({
            success: true,
            outputUrl,
            filename: outputFilename
        });

    } catch (error) {
        console.error('Rendering failed:', error);
        return res.status(500).json({ error: 'Failed to render video', details: error.message });
    }
});

// Implement basic cleanup for old renders (older than 1 day)
app.delete('/api/cleanup-renders', (req, res) => {
    try {
        const files = fs.readdirSync(RENDERS_DIR);
        const now = Date.now();
        let deletedCount = 0;

        files.forEach(file => {
            if (!file.endsWith('.mp4')) return;

            const filePath = path.join(RENDERS_DIR, file);
            const stats = fs.statSync(filePath);
            const ageMs = now - stats.mtimeMs;

            // 24 hours in milliseconds
            if (ageMs > 24 * 60 * 60 * 1000) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });

        res.json({ success: true, deletedCount });
    } catch (err) {
        console.error('Cleanup error:', err);
        res.status(500).json({ error: 'Cleanup failed' });
    }
});

// Endpoint to force browser to download the file instead of playing it
app.get('/api/download', (req, res) => {
    const fileUrl = req.query.url;
    const downloadName = req.query.name || 'glidex-video.mp4';
    if (!fileUrl || !fileUrl.startsWith('/renders/')) {
        return res.status(400).json({ error: 'Invalid file URL' });
    }

    const filename = path.basename(fileUrl);
    const filePath = path.join(RENDERS_DIR, filename);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
        res.setHeader('Cache-Control', 'no-cache');
        const stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } else {
        res.status(404).json({ error: 'File not found on server' });
    }
});

// Re-encode an existing render for compatibility (fix broken videos)
app.post('/api/reencode', async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('/renders/')) {
        return res.status(400).json({ error: 'Invalid file URL' });
    }

    const filename = path.basename(url);
    const inputPath = path.join(RENDERS_DIR, filename);
    const outputFilename = filename.replace('.mp4', '-compat.mp4');
    const outputPath = path.join(RENDERS_DIR, outputFilename);

    if (!fs.existsSync(inputPath)) {
        return res.status(404).json({ error: 'Source file not found' });
    }

    try {
        await new Promise((resolve, reject) => {
            execFile('ffmpeg', [
                '-i', inputPath,
                '-c:v', 'libx264',
                '-profile:v', 'main',
                '-level', '4.0',
                '-pix_fmt', 'yuv420p',
                '-crf', '18',
                '-preset', 'fast',
                '-movflags', '+faststart',
                '-an',                // no audio track needed
                '-y',
                outputPath,
            ], { timeout: 120000 }, (error) => {
                if (error) reject(error);
                else resolve();
            });
        });

        res.json({ success: true, outputUrl: `/renders/${outputFilename}` });
    } catch (error) {
        console.error('Re-encode failed:', error);
        res.status(500).json({ error: 'Re-encode failed', details: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Remotion Rendering Server listening on port ${PORT}`);
});
