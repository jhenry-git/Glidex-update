/**
 * CarShowcasePlayer — Wrapper for per-car showcase video.
 * Designed to be lazy-loaded on the CarDetailPage.
 */

import { Player } from '@remotion/player';
import { CarShowcaseComposition } from '@/components/remotion/CarShowcase';
import {
    CAR_SHOWCASE_DURATION,
    CAR_SHOWCASE_FPS,
} from '@/components/remotion/config';
import type { FormattedCar } from '@/types';

interface CarShowcasePlayerProps {
    car: FormattedCar;
}

export default function CarShowcasePlayer({ car }: CarShowcasePlayerProps) {
    return (
        <Player
            component={CarShowcaseComposition}
            inputProps={{ car }}
            durationInFrames={CAR_SHOWCASE_DURATION}
            fps={CAR_SHOWCASE_FPS}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
                width: '100%',
                borderRadius: '16px',
            }}
            autoPlay
            loop
            controls
        />
    );
}
