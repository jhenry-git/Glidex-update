/**
 * 
 * Creates a 15 - second cinematic slideshow from a single car's images:
    * - Pans through all car images with Ken Burns effect
        * - Displays car specs(brand, model, price, location, rating)
            * - Animated title card + specs grid + CTA closing card
                * 
 * Used in <Player> on the CarDetailPage.
                    */
// @ts-expect-error TypeScript cannot resolve Remotion CJS types with bundler module resolution
import { AbsoluteFill, Sequence, Img, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import type { FormattedCar } from '@/types';

// === CONFIG ===
const FPS = 30;
const TOTAL_DURATION = 15 * FPS; // 15 seconds
const TITLE_CARD_FRAMES = 3 * FPS; // 3 seconds
const CTA_CARD_FRAMES = 3 * FPS; // 3 seconds

const COLORS = {
    dark: '#0B0F17',
    light: '#F4F6F8',
    gold: '#D7A04D',
    gray: 'rgba(244, 246, 248, 0.6)',
};

// === COMPOSITION PROPS ===
export interface CarShowcaseProps {
    car: FormattedCar;
}

// === SUB-COMPONENTS ===

/** Title card — brand, model, name */
function TitleCard({ car }: { car: FormattedCar }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.6 },
    });

    const subtitleSpring = spring({
        frame: frame - 20,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.6 },
    });

    const imageUrl = car.image_urls?.[0] ?? '';

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {/* Background image (blurred) */}
            {imageUrl && (
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(20px) brightness(0.3)',
                        transform: 'scale(1.1)',
                    }}
                />
            )}

            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 80px',
                }}
            >
                {/* Micro label */}
                <div
                    style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: COLORS.gold,
                        marginBottom: 16,
                        opacity: titleSpring,
                    }}
                >
                    GlideX Cars
                </div>

                {/* Brand + Model */}
                <div
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 56,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        color: COLORS.light,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        opacity: titleSpring,
                        transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
                    }}
                >
                    {car.brand}
                    <br />
                    {car.model}
                </div>

                {/* Name subtitle */}
                <div
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 16,
                        color: COLORS.gray,
                        marginTop: 16,
                        opacity: subtitleSpring,
                        transform: `translateY(${interpolate(subtitleSpring, [0, 1], [12, 0])}px)`,
                    }}
                >
                    {car.name}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

/** Image slide with Ken Burns + specs overlay */
function ImageSlide({
    imageUrl,
    car,
    slideIndex,
    totalSlides,
}: {
    imageUrl: string;
    car: FormattedCar;
    slideIndex: number;
    totalSlides: number;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const slideDuration = Math.floor(
        (TOTAL_DURATION - TITLE_CARD_FRAMES - CTA_CARD_FRAMES) / totalSlides
    );

    // Alternate pan direction per slide
    const panDirection = slideIndex % 2 === 0 ? 1 : -1;
    const panX = interpolate(frame, [0, slideDuration], [0, 15 * panDirection], {
        extrapolateRight: 'clamp',
    });
    const scale = interpolate(frame, [0, slideDuration], [1, 1.06], {
        extrapolateRight: 'clamp',
    });

    // Fade in/out
    const fadeIn = interpolate(frame, [0, 12], [0, 1], {
        extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(
        frame,
        [slideDuration - 12, slideDuration],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Spec badge entrance
    const badgeSpring = spring({
        frame: frame - 20,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.4 },
    });

    return (
        <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
            <Img
                src={imageUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale}) translateX(${panX}px)`,
                }}
            />

            {/* Dark gradient bottom */}
            <AbsoluteFill
                style={{
                    background:
                        'linear-gradient(180deg, transparent 50%, rgba(11,15,23,0.7) 100%)',
                }}
            />

            {/* Bottom specs strip */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 48,
                    left: 48,
                    right: 48,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    opacity: badgeSpring,
                    transform: `translateY(${interpolate(badgeSpring, [0, 1], [10, 0])}px)`,
                }}
            >
                {/* Price */}
                <div
                    style={{
                        background: 'rgba(11, 15, 23, 0.7)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 12,
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 4,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: COLORS.gold,
                        }}
                    >
                        KES {car.price.toLocaleString()}
                    </span>
                    <span
                        style={{
                            fontSize: 11,
                            color: 'rgba(215,160,77,0.7)',
                        }}
                    >
                        /day
                    </span>
                </div>

                {/* Location */}
                <div
                    style={{
                        background: 'rgba(11, 15, 23, 0.5)',
                        borderRadius: 12,
                        padding: '8px 14px',
                        fontSize: 12,
                        color: COLORS.gray,
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    📍 {car.location}
                </div>

                {/* Rating */}
                {car.rating > 0 && (
                    <div
                        style={{
                            background: 'rgba(11, 15, 23, 0.5)',
                            borderRadius: 12,
                            padding: '8px 14px',
                            fontSize: 12,
                            color: COLORS.gray,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        ⭐ {Number(car.rating).toFixed(1)}
                    </div>
                )}

                {/* Slide counter */}
                <div
                    style={{
                        marginLeft: 'auto',
                        fontSize: 11,
                        color: 'rgba(244,246,248,0.4)',
                        fontFamily: "'IBM Plex Mono', monospace",
                    }}
                >
                    {slideIndex + 1}/{totalSlides}
                </div>
            </div>
        </AbsoluteFill>
    );
}

/** CTA closing card */
function CtaCard({ car }: { car: FormattedCar }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const ctaSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const imageUrl = car.image_urls?.[0] ?? '';

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {imageUrl && (
                <Img
                    src={imageUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(24px) brightness(0.25)',
                        transform: 'scale(1.1)',
                    }}
                />
            )}

            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 80px',
                }}
            >
                <div
                    style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 36,
                        fontWeight: 800,
                        color: COLORS.light,
                        marginBottom: 20,
                        opacity: ctaSpring,
                        transform: `translateY(${interpolate(ctaSpring, [0, 1], [16, 0])}px)`,
                    }}
                >
                    Book This Car
                </div>

                {/* Price recap */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 6,
                        marginBottom: 24,
                        opacity: ctaSpring,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: COLORS.gold,
                        }}
                    >
                        KES {car.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 14, color: 'rgba(215,160,77,0.7)' }}>
                        /day
                    </span>
                </div>

                {/* CTA button visual */}
                <div
                    style={{
                        background: COLORS.gold,
                        color: COLORS.dark,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                        padding: '14px 40px',
                        borderRadius: 999,
                        opacity: ctaSpring,
                        transform: `translateY(${interpolate(ctaSpring, [0, 1], [12, 0])}px)`,
                    }}
                >
                    Download GlideX App
                </div>

                {/* GlideX branding */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 32,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'rgba(244, 246, 248, 0.3)',
                    }}
                >
                    GlideX
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
}

// === MAIN COMPOSITION ===
export const CarShowcaseComposition: React.FC<CarShowcaseProps> = ({ car }) => {
    const images = car.image_urls ?? [];
    const imageSlides = images.length > 0 ? images : ['/placeholder-car.jpg'];
    const slideDuration = Math.floor(
        (TOTAL_DURATION - TITLE_CARD_FRAMES - CTA_CARD_FRAMES) /
        imageSlides.length
    );

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {/* 1. Title card */}
            <Sequence from={0} durationInFrames={TITLE_CARD_FRAMES}>
                <TitleCard car={car} />
            </Sequence>

            {/* 2. Image slides */}
            {imageSlides.map((img, i) => (
                <Sequence
                    key={i}
                    from={TITLE_CARD_FRAMES + i * slideDuration}
                    durationInFrames={slideDuration}
                >
                    <ImageSlide
                        imageUrl={img}
                        car={car}
                        slideIndex={i}
                        totalSlides={imageSlides.length}
                    />
                </Sequence>
            ))}

            {/* 3. CTA card */}
            <Sequence
                from={TOTAL_DURATION - CTA_CARD_FRAMES}
                durationInFrames={CTA_CARD_FRAMES}
            >
                <CtaCard car={car} />
            </Sequence>
        </AbsoluteFill>
    );
};

export default CarShowcaseComposition;
