import React from 'react';
import { ShieldCheck, Star, Compass, PhoneCall, ArrowDown, CheckCircle2 } from 'lucide-react';

interface SafariHeroProps {
    onOpenEnquiry: (packageName?: string) => void;
}

export const SafariHero: React.FC<SafariHeroProps> = ({ onOpenEnquiry }) => {
    return (
        <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#0B0F17] text-white">
            {/* Background Image with Cinematic Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/ads/safaris/safari_ad_landscape.jpg"
                    alt="African Wildlife Safari with 4x4 Cruiser"
                    className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-[#0B0F17]/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(215,160,77,0.15)_0%,transparent_70%)]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                {/* Trust Pill & Google Ads Intent Hook */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-[#D7A04D] font-medium mb-6 animate-fade-in">
                    <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                    </div>
                    <span className="text-white/90">Rated 4.9/5 by 350+ Safari Adventurers</span>
                    <span className="hidden sm:inline text-white/40">|</span>
                    <span className="hidden sm:inline text-white/80">Kenya’s Premier 4x4 Safari Operator</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
                    Bespoke African Safaris <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6D089] via-[#D7A04D] to-[#E3AA58]">
                        & Custom 4x4 Rentals
                    </span>
                </h1>

                {/* Subheadline & Value Proposition */}
                <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                    Experience the Maasai Mara, Amboseli, and Samburu with Kenya’s most trusted fleet of custom pop-up roof Land Cruisers, certified safari driver-guides, or self-drive 4x4 adventures.
                </p>

                {/* Key Pillars / Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/90 mb-10">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                        <CheckCircle2 className="w-4 h-4 text-[#D7A04D]" />
                        <span>Guaranteed Window Seats</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                        <ShieldCheck className="w-4 h-4 text-[#D7A04D]" />
                        <span>KPSGA Certified Driver-Guides</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                        <Compass className="w-4 h-4 text-[#D7A04D]" />
                        <span>Tailored Private Circuits</span>
                    </div>
                </div>

                {/* High Conversion CTA Group */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                    <button
                        onClick={() => onOpenEnquiry()}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D7A04D] to-[#B8862D] text-[#0B0F17] font-semibold text-base shadow-lg shadow-[#D7A04D]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        <span>Get Instant Safari Quote</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </button>

                    <a
                        href="#packages"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-base backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <Compass className="w-4 h-4 text-[#D7A04D]" />
                        <span>Explore Packages</span>
                    </a>
                </div>

                {/* Emergency / Instant Consultation Callout */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60">
                    <PhoneCall className="w-4 h-4 text-[#D7A04D]" />
                    <span>Immediate assistance or custom itinerary? Call / WhatsApp: </span>
                    <a
                        href="tel:+254768266255"
                        className="text-[#D7A04D] font-semibold hover:underline"
                    >
                        +254 768 266 255
                    </a>
                </div>
            </div>
        </section>
    );
};
