import { useState, useCallback } from 'react';

export type VideoGenerationStatus = 'idle' | 'rendering' | 'complete' | 'error';

export function useVideoGeneration(carId: string | undefined) {
    const [status, setStatus] = useState<VideoGenerationStatus>('idle');
    const [progressMessage, setProgressMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const generateVideo = useCallback(async () => {
        if (!carId) return;

        setStatus('rendering');
        setError(null);
        setProgressMessage('Starting render process...');

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${API_URL}/api/render-car-video`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId, renderType: 'showcase' }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to render video');
            }

            setProgressMessage('Render complete!');
            setStatus('complete');

            // Reload page to fetch the new video URL via useRenderedVideo
            // or we could return the URL and set it in state, but a reload is simpler 
            // to update all components that rely on the pre-rendered video.
            // A more elegant approach is to return the URL:
            return data.outputUrl;

        } catch (err: any) {
            console.error('Video generation error:', err);
            setError(err.message || 'An unexpected error occurred during rendering.');
            setStatus('error');
        }
    }, [carId]);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
        setProgressMessage('');
    }, []);

    return {
        generateVideo,
        status,
        progressMessage,
        error,
        reset,
    };
}
