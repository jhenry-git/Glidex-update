// @ts-nocheck — Remotion CJS types incompatible with tsc bundler resolution.
/**
 * SocialReelComposition — Vertical 9:16 reel for Instagram/TikTok.
 *
 * Auto-generated for each new car listing. Optimized for mobile-first viewing:
 * - Full-screen image hero with animated gradient overlay
 * - Stacked text layout (brand, model, price)
 * - "Swipe up" / "Download GlideX" CTA
 * - 9:16 aspect ratio (1080 × 1920)
 * - 12 seconds at 30fps
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
const FPS = 30;
const TOTAL_DURATION = 12 * FPS; // 12 seconds
const INTRO_FRAMES = 2 * FPS;   // 2s intro
const SLIDE_FRAMES = 5 * FPS;   // 5s main hero
const SPECS_FRAMES = 2 * FPS;   // 2s specs
const CTA_FRAMES = 3 * FPS;     // 3s CTA

const COLORS = {
    dark: '#0B0F17',
    light: '#F4F6F8',
    gold: '#D7A04D',
    goldDark: '#B8862D',
    accent: 'rgba(215, 160, 77, 0.85)',
};

// === COMPOSITION PROPS ===
export interface SocialReelProps {
    car: FormattedCar;
}

// === SUB-COMPONENTS ===

/** Logo intro splash */
function IntroSplash() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logoScale = spring({
        frame: frame - 5,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.5 },
    });

    const subtitleOpacity = spring({
        frame: frame - 20,
        fps,
        config: { damping: 15, stiffness: 80, mass: 0.5 },
    });

    // Exit fade
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
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 64,
                    fontWeight: 900,
                    color: COLORS.light,
                    letterSpacing: '-0.03em',
                    transform: `scale(${logoScale})`,
                }}
            >
                GlideX
            </div>
            <div
                style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: COLORS.gold,
                    marginTop: 12,
                    opacity: subtitleOpacity,
                }}
            >
                Car Rental • Kenya
            </div>
        </AbsoluteFill>
    );
}

/** Main hero slide — full screen car image */
function HeroSlide({ car }: { car: FormattedCar }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const imageUrl = car.image_urls?.[0] ?? '';

    // Slow zoom
    const scale = interpolate(frame, [0, SLIDE_FRAMES], [1, 1.12], {
        extrapolateRight: 'clamp',
    });

    // Text entrances
    const brandSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 90, mass: 0.5 },
    });

    const priceSpring = spring({
        frame: frame - 25,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const locationSpring = spring({
        frame: frame - 35,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    return (
        <AbsoluteFill>
            {/* Full-bleed car image */}
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

            {/* Gradient overlay — heavy bottom for text readability */}
            <AbsoluteFill
                style={{
                    background: `linear-gradient(
                        180deg,
                        rgba(11, 15, 23, 0.2) 0%,
                        rgba(11, 15, 23, 0.0) 30%,
                        rgba(11, 15, 23, 0.5) 60%,
                        rgba(11, 15, 23, 0.92) 100%
                    )`,
                }}
            />

            {/* Text content — bottom-aligned for vertical format */}
            <AbsoluteFill
                style={{
                    justifyContent: 'flex-end',
                    padding: '0 56px 200px 56px',
                }}
            >
                {/* Brand + Model */}
                <div
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 52,
                        fontWeight: 900,
                        lineHeight: 1.05,
                        color: COLORS.light,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        opacity: brandSpring,
                        transform: `translateY(${interpolate(brandSpring, [0, 1], [30, 0])}px)`,
                    }}
                >
                    {car.brand}
                    <br />
                    {car.model}
                </div>

                {/* Price badge */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: 6,
                        marginTop: 20,
                        opacity: priceSpring,
                        transform: `translateY(${interpolate(priceSpring, [0, 1], [20, 0])}px)`,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 36,
                            fontWeight: 700,
                            color: COLORS.gold,
                        }}
                    >
                        KES {car.price.toLocaleString()}
                    </span>
                    <span
                        style={{
                            fontSize: 16,
                            color: 'rgba(215, 160, 77, 0.7)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        /day
                    </span>
                </div>

                {/* Location + Rating */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginTop: 14,
                        opacity: locationSpring,
                        transform: `translateY(${interpolate(locationSpring, [0, 1], [15, 0])}px)`,
                    }}
                >
                    <span
                        style={{
                            fontSize: 15,
                            color: 'rgba(244, 246, 248, 0.7)',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        📍 {car.location}
                    </span>
                    {car.rating > 0 && (
                        <span
                            style={{
                                fontSize: 15,
                                color: 'rgba(244, 246, 248, 0.7)',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            ⭐ {Number(car.rating).toFixed(1)}
                        </span>
                    )}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

/** Specs strip — quick feature badges */
function SpecsStrip({ car }: { car: FormattedCar }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const specs = [
        car.transmission && `⚙️ ${car.transmission}`,
        car.fuel && `⛽ ${car.fuel}`,
        car.capacity && `👥 ${car.capacity} seats`,
        car.engine_cc && `🔧 ${car.engine_cc}cc`,
    ].filter(Boolean);

    const imageUrl = car.image_urls?.[1] ?? car.image_urls?.[0] ?? '';

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {imageUrl && (
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(16px) brightness(0.2)',
                        transform: 'scale(1.1)',
                    }}
                />
            )}
            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 56px',
                    gap: 20,
                }}
            >
                {specs.map((spec, i) => {
                    const specSpring = spring({
                        frame: frame - i * 6 - 5,
                        fps,
                        config: { damping: 12, stiffness: 90, mass: 0.4 },
                    });

                    return (
                        <div
                            key={i}
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 22,
                                color: COLORS.light,
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: 16,
                                padding: '14px 28px',
                                opacity: specSpring,
                                transform: `translateX(${interpolate(specSpring, [0, 1], [-30, 0])}px)`,
                                width: '80%',
                                textAlign: 'center',
                            }}
                        >
                            {spec}
                        </div>
                    );
                })}
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

/** CTA card — "Get GlideX" / "Book Now" */
function CtaCard() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const ctaSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const arrowBounce = Math.sin((frame / fps) * Math.PI * 2) * 6;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.dark,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 64px',
            }}
        >
            {/* Logo */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 42,
                    fontWeight: 900,
                    color: COLORS.light,
                    marginBottom: 24,
                    opacity: ctaSpring,
                }}
            >
                GlideX
            </div>

            {/* CTA text */}
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 20,
                    color: 'rgba(244, 246, 248, 0.6)',
                    marginBottom: 40,
                    opacity: ctaSpring,
                    lineHeight: 1.6,
                }}
            >
                Premium Car Rental
                <br />
                Right at Your Fingertips
            </div>

            {/* CTA button */}
            <div
                style={{
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.dark,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    padding: '18px 48px',
                    borderRadius: 999,
                    opacity: ctaSpring,
                    transform: `translateY(${interpolate(ctaSpring, [0, 1], [20, 0])}px)`,
                }}
            >
                Download GlideX
            </div>

            {/* Swipe up indicator */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    opacity: ctaSpring * 0.5,
                }}
            >
                <div
                    style={{
                        fontSize: 24,
                        transform: `translateY(${arrowBounce}px)`,
                    }}
                >
                    ☝️
                </div>
                <span
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(244,246,248,0.4)',
                    }}
                >
                    Learn more
                </span>
            </div>
        </AbsoluteFill>
    );
}

// === MAIN COMPOSITION ===
export const SocialReelComposition: React.FC<SocialReelProps> = ({ car }) => {
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {/* 1. Logo intro */}
            <Sequence from={0} durationInFrames={INTRO_FRAMES}>
                <IntroSplash />
            </Sequence>

            {/* 2. Hero car shot */}
            <Sequence from={INTRO_FRAMES} durationInFrames={SLIDE_FRAMES}>
                <HeroSlide car={car} />
            </Sequence>

            {/* 3. Specs strip */}
            <Sequence
                from={INTRO_FRAMES + SLIDE_FRAMES}
                durationInFrames={SPECS_FRAMES}
            >
                <SpecsStrip car={car} />
            </Sequence>

            {/* 4. CTA */}
            <Sequence
                from={TOTAL_DURATION - CTA_FRAMES}
                durationInFrames={CTA_FRAMES}
            >
                <CtaCard />
            </Sequence>
        </AbsoluteFill>
    );
};

export const SOCIAL_REEL_DURATION = TOTAL_DURATION;
export const SOCIAL_REEL_FPS = FPS;
export const SOCIAL_REEL_WIDTH = 1080;
export const SOCIAL_REEL_HEIGHT = 1920;

export default SocialReelComposition;
