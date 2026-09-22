import React from 'react';
import { Clock, Check, Sparkles, MapPin, ArrowRight, Compass } from 'lucide-react';

export interface SafariPackageItem {
    id: string;
    title: string;
    tagline: string;
    duration: string;
    location: string;
    image: string;
    highlights: string[];
    vehicleIncluded: string;
    priceGuide: string;
    popular?: boolean;
}

export const safariPackagesData: SafariPackageItem[] = [
    {
        id: 'maasai-mara',
        title: '3-Day Maasai Mara Big Five Expedition',
        tagline: 'Witness the iconic Great Migration & Africa’s densest predator territories',
        duration: '3 Days / 2 Nights',
        location: 'Maasai Mara National Reserve',
        image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800',
        highlights: [
            'Game drives in open savannah for Lions, Leopards & Cheetahs',
            'Spectacular Mara River crossings (seasonal migration)',
            'Luxury tented camp or lodge accommodation',
            'Sunrise bush breakfast or optional hot air balloon flight',
        ],
        vehicleIncluded: 'Custom 4x4 Safari Land Cruiser (Pop-up Roof)',
        priceGuide: 'From $580 / traveler',
        popular: true,
    },
    {
        id: 'amboseli-tsavo',
        title: '4-Day Amboseli & Tsavo: Giants Under Kilimanjaro',
        tagline: 'Huge elephant herds framed against snow-capped Mount Kilimanjaro',
        duration: '4 Days / 3 Nights',
        location: 'Amboseli National Park & Tsavo West',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800',
        highlights: [
            'Unbeatable panoramic views of Mt. Kilimanjaro',
            'Encounter iconic Amboseli elephant super-tuskers',
            'Mzima Springs crystal-clear underwater hippo observatory',
            'Shetani lava flows & volcanic crater vistas',
        ],
        vehicleIncluded: 'Heavy-duty 4x4 Land Cruiser or Prado',
        priceGuide: 'From $690 / traveler',
        popular: false,
    },
    {
        id: 'samburu-olpejeta',
        title: '5-Day Samburu & Ol Pejeta Northern Circuit',
        tagline: 'Northern special five species and Africa’s premier rhino sanctuary',
        duration: '5 Days / 4 Nights',
        location: 'Samburu National Reserve & Ol Pejeta',
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=800',
        highlights: [
            'Spot the rare Northern Special Five (Grevy’s Zebra, Gerenuk, Beisa Oryx)',
            'Visit the Sweetwaters Chimpanzee Sanctuary',
            'Close-range encounters with endangered Black & White Rhinos',
            'Cultural interaction with the Samburu pastoralist community',
        ],
        vehicleIncluded: 'Custom 4x4 Safari Land Cruiser + UHF Radio',
        priceGuide: 'From $890 / traveler',
        popular: false,
    },
    {
        id: 'bush-beach',
        title: '7-Day Ultimate Bush & Beach: Mara + Diani',
        tagline: 'The classic Kenya combo: exhilarating Big Five safari followed by coastal luxury',
        duration: '7 Days / 6 Nights',
        location: 'Maasai Mara & Diani Beach Coast',
        image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=800',
        highlights: [
            '3 days of prime Big Five wildlife tracking in Maasai Mara',
            'Bush flight or high-speed SGR transfer to the Indian Ocean',
            'Relaxation on Diani Beach’s powdery white sands',
            'Kisite-Mpunguti marine park dhow cruise & dolphin safari',
        ],
        vehicleIncluded: '4x4 Safari Cruiser + Coastal Chauffeur Transfers',
        priceGuide: 'From $1,350 / traveler',
        popular: true,
    },
];

interface SafariPackagesProps {
    onSelectPackage: (packageTitle: string) => void;
}

export const SafariPackages: React.FC<SafariPackagesProps> = ({ onSelectPackage }) => {
    return (
        <section id="packages" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D7A04D]/10 text-[#B8862D] text-xs font-semibold uppercase tracking-wider mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        Signature Experiences
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0B0F17] tracking-tight mb-4">
                        Handcrafted African Safari Packages
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Every package is fully customizable. Travel in our verified 4x4 safari cruisers with top-rated driver-guides, or opt for a self-drive expedition.
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {safariPackagesData.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`group relative rounded-3xl overflow-hidden border bg-white transition-all duration-300 hover:shadow-2xl flex flex-col ${
                                pkg.popular
                                    ? 'border-[#D7A04D]/60 ring-1 ring-[#D7A04D]/30'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {/* Card Image Header */}
                            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {pkg.popular && (
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D7A04D] text-[#0B0F17] text-xs font-bold uppercase tracking-wider shadow-md">
                                        Most Popular
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#D7A04D]" />
                                    {pkg.duration}
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm font-medium mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-[#D7A04D]" />
                                        {pkg.location}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug">
                                        {pkg.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-6 italic">
                                        "{pkg.tagline}"
                                    </p>

                                    {/* Highlights */}
                                    <div className="space-y-2.5 mb-6">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Experience Highlights:
                                        </p>
                                        {pkg.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-start gap-2.5 text-sm text-gray-700">
                                                <div className="w-5 h-5 rounded-full bg-amber-50 text-[#D7A04D] flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                                <span>{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Included Vehicle Badge */}
                                    <div className="p-3.5 rounded-xl bg-[#F4F6F8] border border-gray-200/80 mb-6 flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-semibold uppercase text-gray-500 block">
                                                Vehicle Fleet Included
                                            </span>
                                            <span className="text-xs sm:text-sm font-semibold text-[#0B0F17]">
                                                {pkg.vehicleIncluded}
                                            </span>
                                        </div>
                                        <span className="text-xs font-medium text-[#B8862D] bg-[#D7A04D]/15 px-2.5 py-1 rounded-md">
                                            Pop-up Roof
                                        </span>
                                    </div>
                                </div>

                                {/* Price & CTA Footer */}
                                <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8862D] block">
                                            Starting From
                                        </span>
                                        <span className="text-xl sm:text-2xl font-black text-[#0B0F17]">
                                            {pkg.priceGuide}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => onSelectPackage(pkg.title)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B0F17] hover:bg-[#D7A04D] text-white hover:text-[#0B0F17] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                                    >
                                        <span>Request Quote</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Circuit Banner */}
                <div className="mt-12 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#0B0F17] to-[#1a2230] text-white flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl">
                    <div className="max-w-2xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D7A04D] mb-2">
                            <Compass className="w-4 h-4" />
                            Custom Tailor-Made Itineraries
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">
                            Want a Custom Safari Route or Self-Drive 4x4?
                        </h3>
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                            Tell us your dream destinations, dates, and vehicle needs. We’ll curate an exclusive private safari circuit with zero middleman markup.
                        </p>
                    </div>

                    <button
                        onClick={() => onSelectPackage('Custom Tailored Safari Expedition')}
                        className="w-full sm:w-auto shrink-0 px-8 py-4 rounded-xl bg-[#D7A04D] hover:bg-[#c4903f] text-[#0B0F17] font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
                    >
                        Request Custom Quote
                    </button>
                </div>
            </div>
        </section>
    );
};
