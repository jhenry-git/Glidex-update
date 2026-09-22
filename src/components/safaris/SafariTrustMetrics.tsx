import React from 'react';
import { Star, ShieldCheck, Award, HeartHandshake, Quote } from 'lucide-react';

export const SafariTrustMetrics: React.FC = () => {
    const stats = [
        { label: 'Safaris Executed', value: '350+', desc: 'Across Mara, Amboseli & Samburu' },
        { label: 'Customer Rating', value: '4.9 / 5', desc: 'Verified international traveler reviews' },
        { label: 'Fleet Inspection', value: '150-Point', desc: 'Pre-departure check on all 4x4s' },
        { label: 'On-Ground Support', value: '24/7 Live', desc: 'Direct radio & satellite park support' },
    ];

    const testimonials = [
        {
            quote:
                'We booked the 3-day Maasai Mara package bundled with a custom Safari Land Cruiser. Our guide, Peter, was extraordinary—we saw the Big Five on day one! Having our own private 4x4 with the pop-up roof made wildlife photography effortless.',
            author: 'Marcus & Sarah Jenkins',
            origin: 'United Kingdom',
            date: 'Traveled August 2024',
            rating: 5,
        },
        {
            quote:
                'GlideX made renting a Land Cruiser Prado for a self-drive trip to Amboseli completely stress-free. The vehicle was in mint mechanical condition, equipped with heavy-duty all-terrain tires. Truly the best mobility platform in East Africa.',
            author: 'David Van Der Merwe',
            origin: 'South Africa',
            date: 'Traveled November 2024',
            rating: 5,
        },
        {
            quote:
                'From the moment we submitted our enquiry to when we were dropped at JKIA airport, the service was 10/10. Transparent pricing, no hidden park fee surprises, and the WhatsApp team answered every question within minutes.',
            author: 'Elena Rostova',
            origin: 'Germany',
            date: 'Traveled January 2025',
            rating: 5,
        },
    ];

    return (
        <section className="py-20 bg-white border-y border-gray-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Counter Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-16 border-b border-gray-200">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#0B0F17] tracking-tight block mb-1">
                                {stat.value}
                            </span>
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D7A04D] block mb-1">
                                {stat.label}
                            </span>
                            <span className="text-xs text-gray-500 block">
                                {stat.desc}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Trust Badges Bar */}
                <div className="py-12 flex flex-wrap items-center justify-around gap-6 text-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D7A04D] flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Accreditation</p>
                            <p className="text-sm font-bold text-[#0B0F17]">KPSGA Certified Safari Guides</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D7A04D] flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Protection</p>
                            <p className="text-sm font-bold text-[#0B0F17]">Full Comprehensive 4x4 Insurance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D7A04D] flex items-center justify-center">
                            <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Fair Pricing</p>
                            <p className="text-sm font-bold text-[#0B0F17]">Zero Broker Markup Guarantee</p>
                        </div>
                    </div>
                </div>

                {/* Testimonials Header */}
                <div className="text-center max-w-2xl mx-auto mt-4 mb-12">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B0F17]">
                        What Safari Travelers Say
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Real experiences from adventurers exploring Kenya’s wild terrain with GlideX.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-[#F4F6F8] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative"
                        >
                            <Quote className="w-8 h-8 text-[#D7A04D]/30 absolute top-6 right-6" />
                            <div>
                                <div className="flex items-center gap-1 text-amber-500 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                                    "{t.quote}"
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm font-bold text-[#0B0F17]">{t.author}</p>
                                <p className="text-xs text-gray-500">{t.origin} • {t.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
