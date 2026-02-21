// @ts-expect-error TypeScript cannot resolve Remotion CJS types with bundler module resolution
import { Composition } from 'remotion';
import { HeroVideoComposition } from '../src/components/remotion/HeroVideo';
import { CarShowcaseComposition } from '../src/components/remotion/CarShowcase';
import { SocialReelComposition } from '../src/components/remotion/SocialReel';
import { AdPipelineComposition } from '../src/components/remotion/AdPipeline';
import { HostOnboardingComposition } from '../src/components/remotion/HostOnboarding';
import {
    getHeroVideoDuration,
    CAR_SHOWCASE_DURATION,
    CAR_SHOWCASE_FPS,
    SOCIAL_REEL_DURATION,
    SOCIAL_REEL_FPS,
    SOCIAL_REEL_WIDTH,
    SOCIAL_REEL_HEIGHT,
    getAdPipelineDuration,
    AD_PIPELINE_FPS,
    AD_PIPELINE_WIDTH,
    AD_PIPELINE_HEIGHT,
    HOST_ONBOARDING_DURATION,
    HOST_ONBOARDING_FPS,
    HOST_ONBOARDING_WIDTH,
    HOST_ONBOARDING_HEIGHT,
} from '../src/components/remotion/config';

// ─── Sample Data for Preview ───────────────────────────────

const SAMPLE_CAR = {
    id: 'preview-1',
    name: 'GlideX Premium Sedan',
    brand: 'Toyota',
    model: 'Crown',
    price: 8500,
    location: 'Nairobi, Kenya',
    transmission: 'Automatic',
    fuel: 'Petrol',
    engine_cc: 2500,
    capacity: 5,
    image_urls: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
    ],
    is_available: true,
    host_id: 'host-1',
    created_at: new Date().toISOString(),
    description: 'Premium sedan for business and leisure.',
    features: ['Air Conditioning', 'Bluetooth', 'Leather Seats'],
    hostName: 'John Doe',
    hostEmail: 'john@example.com',
    hostPhone: '+254700000000',
    isVerified: true,
    isNew: true,
    rating: 4.8,
    reviews: 24,
};

const SAMPLE_CARS = [
    SAMPLE_CAR,
    {
        ...SAMPLE_CAR,
        id: 'preview-2',
        brand: 'Mercedes',
        model: 'C200',
        price: 12000,
        location: 'Mombasa, Kenya',
        hostName: 'Jane Smith',
        rating: 4.9,
        reviews: 38,
        image_urls: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200',
        ],
    },
    {
        ...SAMPLE_CAR,
        id: 'preview-3',
        brand: 'BMW',
        model: 'X5',
        price: 15000,
        location: 'Kisumu, Kenya',
        hostName: 'Alex Omondi',
        rating: 4.7,
        reviews: 15,
        image_urls: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200',
        ],
    },
    {
        ...SAMPLE_CAR,
        id: 'preview-4',
        brand: 'Range Rover',
        model: 'Sport',
        price: 25000,
        location: 'Nakuru, Kenya',
        hostName: 'Mary Wanjiku',
        rating: 4.6,
        reviews: 9,
        image_urls: [
            'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200',
        ],
    },
];

// ─── Compositions ──────────────────────────────────────────

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* Hero Video — rotating featured cars (Instagram square) */}
            <Composition
                id="HeroVideo"
                component={HeroVideoComposition}
                defaultProps={{ cars: SAMPLE_CARS, showBranding: true }}
                durationInFrames={getHeroVideoDuration(SAMPLE_CARS.length)}
                fps={30}
                width={1080}
                height={1080}
            />

            {/* Car Showcase — per-car cinematic slideshow (landscape) */}
            <Composition
                id="CarShowcase"
                component={CarShowcaseComposition}
                defaultProps={{ car: SAMPLE_CAR }}
                durationInFrames={CAR_SHOWCASE_DURATION}
                fps={CAR_SHOWCASE_FPS}
                width={1920}
                height={1080}
            />

            {/* Social Reel — vertical for Instagram/TikTok */}
            <Composition
                id="SocialReel"
                component={SocialReelComposition}
                defaultProps={{ car: SAMPLE_CAR }}
                durationInFrames={SOCIAL_REEL_DURATION}
                fps={SOCIAL_REEL_FPS}
                width={SOCIAL_REEL_WIDTH}
                height={SOCIAL_REEL_HEIGHT}
            />

            {/* Ad Pipeline — multi-car promotional video */}
            <Composition
                id="AdPipeline"
                component={AdPipelineComposition}
                defaultProps={{
                    cars: SAMPLE_CARS,
                    headline: 'Drive Your Dream',
                    subtitle: 'Premium cars, flexible rentals',
                }}
                durationInFrames={getAdPipelineDuration(SAMPLE_CARS.length)}
                fps={AD_PIPELINE_FPS}
                width={AD_PIPELINE_WIDTH}
                height={AD_PIPELINE_HEIGHT}
            />

            {/* Host Onboarding — personalized welcome */}
            <Composition
                id="HostOnboarding"
                component={HostOnboardingComposition}
                defaultProps={{ hostName: 'John Doe' }}
                durationInFrames={HOST_ONBOARDING_DURATION}
                fps={HOST_ONBOARDING_FPS}
                width={HOST_ONBOARDING_WIDTH}
                height={HOST_ONBOARDING_HEIGHT}
            />

            {/* OG Video — social link preview (compact) */}
            <Composition
                id="OGVideo"
                component={CarShowcaseComposition}
                defaultProps={{ car: SAMPLE_CAR }}
                durationInFrames={Math.floor(CAR_SHOWCASE_FPS * 6)}
                fps={CAR_SHOWCASE_FPS}
                width={1200}
                height={630}
            />
        </>
    );
};
