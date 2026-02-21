/**
 * CarDetailPage — Full car detail view with gallery, specs, reviews, and booking.
 * Data sourced from Supabase via useCarDetail hook.
 */

import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    MapPin,
    Fuel,
    Settings,
    Users,
    BadgeCheck,
    Calendar,
    MessageCircle,
    Share2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import { Film } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCarDetail } from '@/hooks/useCarDetail';
import { useRenderedVideo } from '@/hooks/useRenderedVideo';
import { useOgMeta } from '@/hooks/useOgMeta';
import { PricingFAQSchema } from '@/components/seo/PricingFAQSchema';

// Lazy-load the Remotion showcase player (only if no pre-rendered video)
const CarShowcasePlayer = lazy(() => import('@/components/remotion/CarShowcasePlayer'));

export default function CarDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { car, reviews, loading, error } = useCarDetail(id);
    const { showcaseUrl, ogVideoUrl } = useRenderedVideo(id);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Dynamic OG meta tags for social sharing
    useOgMeta(
        car
            ? {
                title: `${car.brand} ${car.model} — KES ${car.price.toLocaleString()}/day | GlideX`,
                description: `Rent this ${car.brand} ${car.model} in ${car.location}. ${car.rating > 0 ? `⭐ ${Number(car.rating).toFixed(1)} rating.` : ''} Book on GlideX!`,
                image: car.image_urls?.[0],
                video: ogVideoUrl ?? undefined,
                type: 'product',
                structuredData: {
                    "@context": "https://schema.org",
                    "@type": "Car",
                    "name": `${car.brand} ${car.model}`,
                    "description": car.description,
                    "image": car.image_urls?.[0],
                    "brand": {
                        "@type": "Brand",
                        "name": car.brand
                    },
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "KES",
                        "price": car.price,
                        "availability": "https://schema.org/InStock",
                        "url": window.location.href
                    }
                }
            }
            : null
    );

    // Share handler
    const handleShare = async () => {
        const url = window.location.href;
        const text = car
            ? `Check out this ${car.brand} ${car.model} on GlideX! KES ${car.price.toLocaleString()}/day`
            : 'Check out this car on GlideX!';

        if (navigator.share) {
            try {
                await navigator.share({ title: 'GlideX Car', text, url });
            } catch {
                // User cancelled share
            }
        } else {
            await navigator.clipboard.writeText(`${text}\n${url}`);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6F8]">
                <Navbar />
                <div className="pt-24 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D7A04D]" />
                        <p className="text-sm text-gray-500">Loading car details…</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !car) {
        return (
            <div className="min-h-screen bg-[#F4F6F8]">
                <Navbar />
                <div className="pt-24 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4 text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-[#0B0F17]">
                            Car not found
                        </h2>
                        <p className="text-sm text-gray-500 max-w-sm">
                            This listing may have been removed or is no longer available.
                        </p>
                        <button
                            onClick={() => navigate('/listings')}
                            className="btn-primary text-sm mt-2"
                        >
                            Browse all cars
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const images = car.image_urls ?? [];
    const currentImage = images[activeImageIndex] ?? '/placeholder-car.jpg';

    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            <div className="grain-overlay" />
            <Navbar />

            <main className="pt-20 pb-16">
                <PricingFAQSchema />
                {/* Back + share row */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B0F17] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B0F17] transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left column: Gallery */}
                        <div className="lg:col-span-3">
                            {/* Main image */}
                            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                                <img
                                    src={currentImage}
                                    alt={`${car.brand} ${car.model}`}
                                    className="w-full h-full object-cover"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setActiveImageIndex((i) =>
                                                    i > 0 ? i - 1 : images.length - 1
                                                )
                                            }
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-[#0B0F17]" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveImageIndex((i) =>
                                                    i < images.length - 1 ? i + 1 : 0
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-[#0B0F17]" />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                            {activeImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImageIndex(i)}
                                            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${i === activeImageIndex
                                                ? 'ring-2 ring-[#D7A04D] ring-offset-2 opacity-100'
                                                : 'opacity-50 hover:opacity-80'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`View ${i + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Remotion Showcase Video */}
                            {images.length > 0 && (
                                <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Film className="w-4 h-4 text-[#D7A04D]" />
                                        <h3 className="font-semibold text-[#0B0F17] text-sm">
                                            Watch Showcase
                                        </h3>
                                        {showcaseUrl && (
                                            <span className="ml-auto text-[10px] text-emerald-500 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                                                HD Render
                                            </span>
                                        )}
                                    </div>
                                    {showcaseUrl ? (
                                        /* Pre-rendered MP4 — best quality, zero compute cost */
                                        <video
                                            src={showcaseUrl}
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full rounded-2xl"
                                            poster={car.image_urls?.[0]}
                                        />
                                    ) : (
                                        /* Remotion Player — live rendering fallback */
                                        <Suspense
                                            fallback={
                                                <div className="aspect-video bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
                                                    <Film className="w-8 h-8 text-gray-300" />
                                                </div>
                                            }
                                        >
                                            <CarShowcasePlayer car={car} />
                                        </Suspense>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            {car.description && (
                                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-[#0B0F17] mb-3">About this car</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {car.description}
                                    </p>
                                </div>
                            )}

                            {/* Reviews */}
                            {reviews.length > 0 && (
                                <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-semibold text-[#0B0F17]">
                                            Reviews ({reviews.length})
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-semibold">
                                                {Number(car.rating).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {reviews.slice(0, 5).map((review) => (
                                            <div
                                                key={review.id}
                                                className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${i < review.rating
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-gray-200'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[11px] text-gray-400">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm text-gray-600">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right column: Info + Booking */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-24 space-y-5">
                                {/* Main info card */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {car.isNew && (
                                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                                                ✨ New Listing
                                            </span>
                                        )}
                                        {car.isVerified && (
                                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                                                <BadgeCheck className="w-3 h-3" />
                                                Verified Host
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-2xl font-bold text-[#0B0F17] mb-1">
                                        {car.brand} {car.model}
                                    </h1>
                                    <p className="text-sm text-gray-500 mb-4">{car.name}</p>

                                    {/* Rating */}
                                    {car.rating > 0 && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-semibold">
                                                {Number(car.rating).toFixed(1)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                ({car.reviews} review{car.reviews !== 1 ? 's' : ''})
                                            </span>
                                        </div>
                                    )}

                                    {/* Location */}
                                    <div className="flex items-center gap-2 mb-5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">{car.location}</span>
                                    </div>

                                    {/* Specs grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {car.transmission && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                                                <Settings className="w-4 h-4 text-gray-400" />
                                                {car.transmission}
                                            </div>
                                        )}
                                        {car.fuel && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                                                <Fuel className="w-4 h-4 text-gray-400" />
                                                {car.fuel}
                                            </div>
                                        )}
                                        {car.capacity && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                {car.capacity} seats
                                            </div>
                                        )}
                                        {car.engine_cc && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                                                <Settings className="w-4 h-4 text-gray-400" />
                                                {car.engine_cc}cc
                                            </div>
                                        )}
                                    </div>

                                    {/* Features */}
                                    {car.features && car.features.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-[#0B0F17] mb-2">
                                                Features
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {car.features.map((feature, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 my-5" />

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1 mb-5">
                                        <span className="text-3xl font-bold text-[#0B0F17]">
                                            KES {car.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-400">/day</span>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="space-y-3">
                                        <a
                                            href="https://apps.apple.com/app/id6751563258"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary w-full justify-center text-sm"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Book on GlideX App
                                        </a>
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`I'm interested in renting the ${car.brand} ${car.model} on GlideX! ${window.location.href}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary w-full justify-center text-sm"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Contact via WhatsApp
                                        </a>
                                    </div>
                                </div>

                                {/* Host card */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm">
                                    <h4 className="text-sm font-semibold text-[#0B0F17] mb-3">
                                        Your Host
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D7A04D] to-[#B8862D] flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {car.hostName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#0B0F17]">
                                                {car.hostName}
                                            </p>
                                            {car.isVerified && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <BadgeCheck className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-[11px] text-emerald-600">
                                                        Verified Host
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
