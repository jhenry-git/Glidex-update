/**
 * HostOnboardingComposition — Personalized welcome video for new hosts.
 *
 * Generated when a user is approved as a host on GlideX.
 * Shows: welcome message with host name, 3-step how-it-works guide,
 * and earnings potential CTA.
 *
 * 1920 × 1080, 18 seconds at 30fps
 */

// @ts-expect-error TypeScript cannot resolve Remotion CJS types with bundler module resolution
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// === CONFIG ===
const FPS = 30;
const TOTAL_DURATION = 18 * FPS;
const WELCOME_FRAMES = 5 * FPS;
const STEP_FRAMES = 3 * FPS;
const OUTRO_FRAMES = 4 * FPS;

const COLORS = {
    dark: '#0B0F17',
    light: '#F4F6F8',
    gold: '#D7A04D',
    goldDark: '#B8862D',
    emerald: '#10B981',
};

// === COMPOSITION PROPS ===
export interface HostOnboardingProps {
    hostName: string;
    hostAvatarUrl?: string;
}

// === SUB-COMPONENTS ===

/** Welcome screen with host name */
function WelcomeScreen({ hostName }: { hostName: string }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const welcomeSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 12, stiffness: 80, mass: 0.6 },
    });

    const nameSpring = spring({
        frame: frame - 25,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const subtitleSpring = spring({
        frame: frame - 40,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    // Exit fade
    const exit = interpolate(
        frame,
        [WELCOME_FRAMES - 15, WELCOME_FRAMES],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.dark,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                opacity: exit,
            }}
        >
            {/* Decorative ring */}
            <div
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 32,
                    opacity: welcomeSpring,
                    transform: `scale(${welcomeSpring})`,
                }}
            >
                <span
                    style={{
                        fontSize: 48,
                        fontWeight: 800,
                        color: COLORS.dark,
                        fontFamily: "'Montserrat', sans-serif",
                    }}
                >
                    {hostName.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Welcome text */}
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    color: COLORS.gold,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                    opacity: welcomeSpring,
                }}
            >
                Welcome to GlideX
            </div>

            {/* Host name */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 52,
                    fontWeight: 900,
                    color: COLORS.light,
                    opacity: nameSpring,
                    transform: `translateY(${interpolate(nameSpring, [0, 1], [20, 0])}px)`,
                }}
            >
                {hostName}
            </div>

            {/* Subtitle */}
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    color: 'rgba(244, 246, 248, 0.5)',
                    marginTop: 16,
                    opacity: subtitleSpring,
                }}
            >
                You're now a verified host 🎉
            </div>
        </AbsoluteFill>
    );
}

/** Step card for the how-it-works section */
function StepCard({
    stepNumber,
    icon,
    title,
    description,
}: {
    stepNumber: number;
    icon: string;
    title: string;
    description: string;
}) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const cardSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 90, mass: 0.5 },
    });

    const contentSpring = spring({
        frame: frame - 20,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const exit = interpolate(
        frame,
        [STEP_FRAMES - 12, STEP_FRAMES],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.dark,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 120px',
                opacity: exit,
            }}
        >
            {/* Step number */}
            <div
                style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: COLORS.gold,
                    marginBottom: 24,
                    opacity: cardSpring,
                }}
            >
                STEP {stepNumber} OF 3
            </div>

            {/* Icon */}
            <div
                style={{
                    fontSize: 64,
                    marginBottom: 24,
                    opacity: cardSpring,
                    transform: `scale(${cardSpring})`,
                }}
            >
                {icon}
            </div>

            {/* Title */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 36,
                    fontWeight: 800,
                    color: COLORS.light,
                    marginBottom: 12,
                    opacity: contentSpring,
                    transform: `translateY(${interpolate(contentSpring, [0, 1], [15, 0])}px)`,
                }}
            >
                {title}
            </div>

            {/* Description */}
            <div
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 18,
                    color: 'rgba(244, 246, 248, 0.55)',
                    lineHeight: 1.6,
                    maxWidth: 600,
                    opacity: contentSpring,
                }}
            >
                {description}
            </div>

            {/* Progress dots */}
            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 40,
                    opacity: cardSpring,
                }}
            >
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        style={{
                            width: n === stepNumber ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor:
                                n === stepNumber ? COLORS.gold : 'rgba(244,246,248,0.15)',
                            transition: 'width 0.3s',
                        }}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
}

/** Earnings potential + CTA outro */
function EarningsOutro({ hostName }: { hostName: string }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const mainSpring = spring({
        frame: frame - 10,
        fps,
        config: { damping: 14, stiffness: 80, mass: 0.5 },
    });

    const numbersSpring = spring({
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
                padding: '0 100px',
            }}
        >
            {/* Earnings headline */}
            <div
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 32,
                    fontWeight: 800,
                    color: COLORS.light,
                    marginBottom: 36,
                    opacity: mainSpring,
                    transform: `translateY(${interpolate(mainSpring, [0, 1], [15, 0])}px)`,
                }}
            >
                Start Earning, {hostName}
            </div>

            {/* Earnings tiers */}
            <div
                style={{
                    display: 'flex',
                    gap: 48,
                    marginBottom: 48,
                    opacity: numbersSpring,
                }}
            >
                {[
                    { cars: '1 Car', earnings: 'KES 150K+/mo' },
                    { cars: '3 Cars', earnings: 'KES 400K+/mo' },
                    { cars: '5+ Cars', earnings: 'KES 800K+/mo' },
                ].map((tier, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 28,
                                fontWeight: 700,
                                color: COLORS.emerald,
                            }}
                        >
                            {tier.earnings}
                        </div>
                        <div
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13,
                                color: 'rgba(244,246,248,0.4)',
                                marginTop: 6,
                            }}
                        >
                            {tier.cars}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
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
                    transform: `translateY(${interpolate(ctaSpring, [0, 1], [12, 0])}px)`,
                }}
            >
                List Your First Car
            </div>

            {/* Branding */}
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
export const HostOnboardingComposition: React.FC<HostOnboardingProps> = ({
    hostName,
}) => {
    const steps = [
        {
            icon: '📸',
            title: 'List Your Car',
            description:
                'Upload photos, set your price, and describe your vehicle. It takes less than 5 minutes.',
        },
        {
            icon: '✅',
            title: 'Get Verified',
            description:
                'Our team reviews your listing and verifies your identity for trust and safety.',
        },
        {
            icon: '💰',
            title: 'Start Earning',
            description:
                'Accept bookings, meet renters, and earn money from your car whenever it sits idle.',
        },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
            {/* 1. Welcome */}
            <Sequence from={0} durationInFrames={WELCOME_FRAMES}>
                <WelcomeScreen hostName={hostName} />
            </Sequence>

            {/* 2. Steps */}
            {steps.map((step, i) => (
                <Sequence
                    key={i}
                    from={WELCOME_FRAMES + i * STEP_FRAMES}
                    durationInFrames={STEP_FRAMES}
                >
                    <StepCard
                        stepNumber={i + 1}
                        icon={step.icon}
                        title={step.title}
                        description={step.description}
                    />
                </Sequence>
            ))}

            {/* 3. Earnings + CTA */}
            <Sequence
                from={TOTAL_DURATION - OUTRO_FRAMES}
                durationInFrames={OUTRO_FRAMES}
            >
                <EarningsOutro hostName={hostName} />
            </Sequence>
        </AbsoluteFill>
    );
};

export default HostOnboardingComposition;
