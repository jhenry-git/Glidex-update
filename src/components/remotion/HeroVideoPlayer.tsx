/**
 * HeroVideoPlayer — Wrapper that combines Remotion Player + HeroVideo composition.
 * Designed to be lazy-loaded as a single unit for code splitting.
 */

import { Player } from '@remotion/player';
import {
    HeroVideoComposition,
    getHeroVideoDuration,
} from '@/components/remotion/HeroVideo';
import type { FormattedCar } from '@/types';

interface HeroVideoPlayerProps {
    cars: FormattedCar[];
}

export default function HeroVideoPlayer({ cars }: HeroVideoPlayerProps) {
    const duration = getHeroVideoDuration(cars.length);

    return (
        <Player
            component={HeroVideoComposition}
            inputProps={{ cars, showBranding: false }}
            durationInFrames={duration}
            fps={30}
            compositionWidth={1080}
            compositionHeight={1080}
            style={{
                width: '100%',
                height: '100%',
                borderRadius: '9999px',
            }}
            autoPlay
            loop
            controls={false}
        />
    );
}
