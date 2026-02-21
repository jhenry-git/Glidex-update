/**
 * useRenderedVideo — React hook for fetching pre-rendered video assets.
 * Falls back to null if no render exists (component should show Remotion Player instead).
 */

import { useState, useEffect } from 'react';
import { getCarMediaAssets } from '@/api/renders';

interface CarMediaAssets {
    showcaseUrl: string | null;
    ogVideoUrl: string | null;
    reelUrl: string | null;
}

export function useRenderedVideo(carId: string | undefined) {
    const [assets, setAssets] = useState<CarMediaAssets>({
        showcaseUrl: null,
        ogVideoUrl: null,
        reelUrl: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!carId) {
            Promise.resolve().then(() => setLoading(false));
            return;
        }

        getCarMediaAssets(carId)
            .then(setAssets)
            .catch(() => {
                // Silently fall back — Remotion Player will be used instead
            })
            .finally(() => setLoading(false));
    }, [carId]);

    return {
        ...assets,
        loading,
        hasPreRendered: Boolean(assets.showcaseUrl),
    };
}
