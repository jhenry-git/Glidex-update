/**
 * AdPipelineComposition — Multi-car promotional video for marketing campaigns.
 *
 * Showcases a curated collection of cars for:
 * - Social media ads (Facebook, Instagram stories)
 * - Email marketing campaigns
 * - Website promotional banners
 *
 * Features: logo intro, multi-car carousel, stats overlay, CTA
 * 1920 × 1080 (landscape), 20 seconds at 30fps
 */

// @ts-expect-error TypeScript cannot resolve Remotion CJS types with bundler module resolution
import { AbsoluteFill, Sequence, Img, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import type { FormattedCar } from '@/types';

// === CONFIG ===
const FPS = 30;
const INTRO_FRAMES = 3 * FPS;
const FRAMES_PER_CAR = 3 * FPS;
const OUTRO_FRAMES = 4 * FPS;

const COLORS = {
    dark: '#0B0F17',
    light: '#F4F6F8',
    gold: '#D7A04D',
    goldDark: '#B8862D',
};

// === COMPOSITION PROPS ===
export interface AdPipelineProps {
    cars: FormattedCar[];
    headline?: string;
    subtitle?: string;
}

// === SUB-COMPONENTS ===

/** Cinematic intro with headline */
function AdIntro({
    headline,
    subtitle,
}: {
    headline: string;
    subtitle: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const headlineSpring = spring({
        frame: frame - 8,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.6 },
    });

    const subtitleSpring = spring({
        frame: frame - 20,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const exit = interpolate(
        frame,
        [INTRO_FRAMES - 15, INTRO_FRAMES],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.dark,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: exit,
            }}
        >
            {/* Decorative gradient */}
            <div
                style={{
                    position: 'absolute',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${COLORS.gold}15 0%, transparent 70%)`,
                }}
            />

            {/* GlideX logo */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 28,
                    fontWeight: 900,
                    color: COLORS.gold,
                    letterSpacing: '0.1em',
                    marginBottom: 32,
                    opacity: headlineSpring,
                }}
            >
                GLIDEX
            </div>

            {/* Main headline */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 56,
                    fontWeight: 900,
                    color: COLORS.light,
                    textAlign: 'center',
                    lineHeight: 1.1,
                    maxWidth: 800,
                    opacity: headlineSpring,
                    transform: `translateY(${interpolate(headlineSpring, [0, 1], [20, 0])}px)`,
                }}
            >
                {headline}
            </div>

            {/* Subtitle */}
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    color: 'rgba(244, 246, 248, 0.5)',
                    marginTop: 20,
                    opacity: subtitleSpring,
                }}
            >
                {subtitle}
            </div>
        </AbsoluteFill>
    );
}

/** Individual car slide for carousel */
function CarSlide({
    car,
    index,
    total,
}: {
    car: FormattedCar;
    index: number;
    total: number;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const imageUrl = car.image_urls?.[0] ?? '';

    // Ken Burns
    const scale = interpolate(frame, [0, FRAMES_PER_CAR], [1, 1.06], {
        extrapolateRight: 'clamp',
    });

    // Text entrance
    const textSpring = spring({
        frame: frame - 8,
        fps,
        config: { damping: 14, stiffness: 90, mass: 0.5 },
    });

    // Cross-fade
    const fadeIn = interpolate(frame, [0, 10], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(
        frame,
        [FRAMES_PER_CAR - 10, FRAMES_PER_CAR],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
            {/* Split layout: image left, info right */}
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                }}
            >
                {/* Image — 60% width */}
                <div
                    style={{
                        width: '60%',
                        height: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
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
                    {/* Image counter */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 24,
                            left: 24,
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: 11,
                            color: 'rgba(244,246,248,0.5)',
                            backgroundColor: 'rgba(11,15,23,0.6)',
                            padding: '4px 10px',
                            borderRadius: 6,
                        }}
                    >
                        {index + 1} / {total}
                    </div>
                </div>

                {/* Info — 40% width */}
                <div
                    style={{
                        width: '40%',
                        height: '100%',
                        backgroundColor: COLORS.dark,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '0 56px',
                    }}
                >
                    {/* Brand + Model */}
                    <div
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 40,
                            fontWeight: 800,
                            color: COLORS.light,
                            lineHeight: 1.1,
                            textTransform: 'uppercase',
                            marginBottom: 16,
                            opacity: textSpring,
                            transform: `translateY(${interpolate(textSpring, [0, 1], [15, 0])}px)`,
                        }}
                    >
                        {car.brand}
                        <br />
                        {car.model}
                    </div>

                    {/* Price */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 4,
                            marginBottom: 20,
                            opacity: textSpring,
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
                        <span style={{ fontSize: 14, color: 'rgba(215,160,77,0.6)' }}>
                            /day
                        </span>
                    </div>

                    {/* Location + Rating */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            opacity: textSpring,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 14,
                                color: 'rgba(244,246,248,0.5)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            📍 {car.location}
                        </span>
                        {car.rating > 0 && (
                            <span
                                style={{
                                    fontSize: 14,
                                    color: 'rgba(244,246,248,0.5)',
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                ⭐ {Number(car.rating).toFixed(1)} ({car.reviews}{' '}
                                reviews)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
}

/** Outro with stats + CTA */
function AdOutro({ carCount }: { carCount: number }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const mainSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const statsSpring = spring({
        frame: frame - 25,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const ctaSpring = spring({
        frame: frame - 40,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.dark,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 80px',
            }}
        >
            {/* Stats row */}
            <div
                style={{
                    display: 'flex',
                    gap: 60,
                    marginBottom: 48,
                    opacity: statsSpring,
                }}
            >
                {[
                    { value: `${carCount}+`, label: 'Cars Available' },
                    { value: '4.8', label: 'Avg Rating' },
                    { value: '24/7', label: 'Support' },
                ].map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 36,
                                fontWeight: 800,
                                color: COLORS.gold,
                            }}
                        >
                            {stat.value}
                        </div>
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 12,
                                color: 'rgba(244,246,248,0.4)',
                                marginTop: 4,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 32,
                    fontWeight: 800,
                    color: COLORS.light,
                    marginBottom: 24,
                    opacity: mainSpring,
                    transform: `translateY(${interpolate(mainSpring, [0, 1], [15, 0])}px)`,
                }}
            >
                Your Ride is Waiting
            </div>

            <div
                style={{
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.dark,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    padding: '16px 44px',
                    borderRadius: 999,
                    opacity: ctaSpring,
                    transform: `translateY(${interpolate(ctaSpring, [0, 1], [15, 0])}px)`,
                }}
            >
                Download GlideX Today
            </div>

            {/* Footer branding */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 24,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: 'rgba(244,246,248,0.2)',
                    letterSpacing: '0.15em',
                }}
            >
                GLIDEX.COM
            </div>
        </AbsoluteFill>
    );
}

// === MAIN COMPOSITION ===
export const AdPipelineComposition: React.FC<AdPipelineProps> = ({
    cars,
    headline = 'Drive Your Dream',
    subtitle = 'Premium cars, flexible rentals',
}) => {
    const displayCars = cars.slice(0, 4); // Max 4 cars in the ad
    const carSectionDuration = displayCars.length * FRAMES_PER_CAR;

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {/* 1. Intro */}
            <Sequence from={0} durationInFrames={INTRO_FRAMES}>
                <AdIntro headline={headline} subtitle={subtitle} />
            </Sequence>

            {/* 2. Car carousel */}
            {displayCars.map((car, i) => (
                <Sequence
                    key={car.id}
                    from={INTRO_FRAMES + i * FRAMES_PER_CAR}
                    durationInFrames={FRAMES_PER_CAR}
                >
                    <CarSlide
                        car={car}
                        index={i}
                        total={displayCars.length}
                    />
                </Sequence>
            ))}

            {/* 3. Outro with stats + CTA */}
            <Sequence
                from={INTRO_FRAMES + carSectionDuration}
                durationInFrames={OUTRO_FRAMES}
            >
                <AdOutro carCount={cars.length} />
            </Sequence>
        </AbsoluteFill>
    );
};

export default AdPipelineComposition;
