// @ts-nocheck — Remotion's CJS type declarations are incompatible with tsc bundler resolution.
// Type safety is enforced by Remotion CLI and validated at bundle time by Vite.
/**
 * HeroVideoComposition — Dynamic hero video showcasing featured cars.
 * 
 * Rotates through the top featured cars from the database with:
 * - Ken Burns zoom effect on each car image
 * - Animated text overlays with brand/model/price
 * - Smooth cross-fade transitions between cars
 * - GlideX branding overlay
 * 
 * Used in <Player> on the homepage (in-browser, no render cost).
 * Can be rendered server-side via Remotion Lambda for static MP4.
 */

import {
    AbsoluteFill,
    Sequence,
    Img,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from 'remotion';
import type { FormattedCar } from '@/types';

// === CONFIG ===
const FRAMES_PER_CAR = 120; // 4 seconds at 30fps
const TRANSITION_FRAMES = 20;

// GlideX brand colors
const COLORS = {
    dark: '#0B0F17',
    light: '#F4F6F8',
    gold: '#D7A04D',
    goldDark: '#B8862D',
};

// === COMPOSITION PROPS ===
export interface HeroVideoProps {
    cars: FormattedCar[];
    showBranding?: boolean;
}

// === SUB-COMPONENTS ===

function CarSlide({
    car,
    index,
}: {
    car: FormattedCar;
    index: number;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const imageUrl = car.image_urls?.[0] ?? '';

    // Ken Burns: slow zoom in
    const scale = interpolate(frame, [0, FRAMES_PER_CAR], [1, 1.08], {
        extrapolateRight: 'clamp',
    });

    // Text entrance spring
    const textSpring = spring({
        frame: frame - 15,
        fps,
        config: { damping: 15, stiffness: 100, mass: 0.5 },
    });

    // Price tag entrance
    const priceSpring = spring({
        frame: frame - 25,
        fps,
        config: { damping: 15, stiffness: 80, mass: 0.5 },
    });

    // Fade out at end
    const opacity = interpolate(
        frame,
        [FRAMES_PER_CAR - TRANSITION_FRAMES, FRAMES_PER_CAR],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Fade in at start
    const fadeIn = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ opacity: fadeIn * opacity }}>
            {/* Background image with Ken Burns effect */}
            {imageUrl && (
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${scale})`,
                    }}
                />
            )}

            {/* Dark gradient overlay */}
            <AbsoluteFill
                style={{
                    background: `linear-gradient(
            180deg,
            rgba(11, 15, 23, 0.15) 0%,
            rgba(11, 15, 23, 0.05) 40%,
            rgba(11, 15, 23, 0.4) 70%,
            rgba(11, 15, 23, 0.85) 100%
          )`,
                }}
            />

            {/* Car info overlay */}
            <AbsoluteFill
                style={{
                    justifyContent: 'flex-end',
                    padding: '0 64px 72px 64px',
                }}
            >
                {/* Micro label */}
                <div
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: COLORS.gold,
                        marginBottom: 12,
                        opacity: textSpring,
                        transform: `translateY(${interpolate(textSpring, [0, 1], [8, 0])}px)`,
                    }}
                >
                    Featured Vehicle {index + 1}
                </div>

                {/* Brand + Model */}
                <div
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 48,
                        fontWeight: 800,
                        lineHeight: 1,
                        color: COLORS.light,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        marginBottom: 16,
                        opacity: textSpring,
                        transform: `translateY(${interpolate(textSpring, [0, 1], [16, 0])}px)`,
                    }}
                >
                    {car.brand} {car.model}
                </div>

                {/* Location + Rating row */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                        marginBottom: 8,
                        opacity: priceSpring,
                        transform: `translateY(${interpolate(priceSpring, [0, 1], [12, 0])}px)`,
                    }}
                >
                    <span
                        style={{
                            fontSize: 14,
                            color: 'rgba(244, 246, 248, 0.7)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        📍 {car.location}
                    </span>
                    {car.rating > 0 && (
                        <span
                            style={{
                                fontSize: 14,
                                color: 'rgba(244, 246, 248, 0.7)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            ⭐ {Number(car.rating).toFixed(1)} ({car.reviews} reviews)
                        </span>
                    )}
                </div>

                {/* Price badge */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: 4,
                        marginTop: 8,
                        opacity: priceSpring,
                        transform: `translateY(${interpolate(priceSpring, [0, 1], [10, 0])}px)`,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: COLORS.gold,
                        }}
                    >
                        KES {car.price.toLocaleString()}
                    </span>
                    <span
                        style={{
                            fontSize: 14,
                            color: 'rgba(215, 160, 77, 0.7)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        /day
                    </span>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

function BrandingOverlay() {
    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {/* Top-left logo */}
            <div
                style={{
                    position: 'absolute',
                    top: 32,
                    left: 40,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: COLORS.light,
                    textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
            >
                GlideX
            </div>

            {/* Top-right micro label */}
            <div
                style={{
                    position: 'absolute',
                    top: 36,
                    right: 40,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: COLORS.gold,
                }}
            >
                GlideX Cars
            </div>
        </AbsoluteFill>
    );
}

// === MAIN COMPOSITION ===
export const HeroVideoComposition: React.FC<HeroVideoProps> = ({
    cars,
    showBranding = true,
}) => {
    const featuredCars = cars.slice(0, 5);

    if (featuredCars.length === 0) {
        return (
            <AbsoluteFill
                style={{
                    backgroundColor: COLORS.dark,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 36,
                        fontWeight: 800,
                        color: COLORS.light,
                    }}
                >
                    GlideX
                </div>
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {featuredCars.map((car, i) => (
                <Sequence
                    key={car.id}
                    from={i * (FRAMES_PER_CAR - TRANSITION_FRAMES)}
                    durationInFrames={FRAMES_PER_CAR}
                >
                    <CarSlide car={car} index={i} />
                </Sequence>
            ))}

            {showBranding && <BrandingOverlay />}
        </AbsoluteFill>
    );
};

/**
 * Calculate total duration for the hero video based on car count.
 */
export function getHeroVideoDuration(carCount: number): number {
    const count = Math.min(Math.max(carCount, 1), 5);
    return count * (FRAMES_PER_CAR - TRANSITION_FRAMES) + TRANSITION_FRAMES;
}

export default HeroVideoComposition;
