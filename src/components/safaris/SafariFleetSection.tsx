import React from 'react';
import { Check, Car, UserCheck, KeyRound } from 'lucide-react';

interface SafariFleetProps {
    onSelectVehicle: (vehicleName: string) => void;
}

export const SafariFleetSection: React.FC<SafariFleetProps> = ({ onSelectVehicle }) => {
    const fleet = [
        {
            name: 'Custom 4x4 Safari Land Cruiser',
            subtitle: 'The Gold Standard of African Game Drives',
            category: 'Pop-Up Roof Expedition',
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
            seats: '6 - 7 Window Seats',
            features: [
                'Full hydraulic pop-up roof for 360° unobstructed photography',
                'Dual heavy-duty spare tires & high-lift recovery jacks',
                'Built-in electric cooler box for chilled refreshments',
                'UHF two-way radio linked to ranger stations & safari guides',
                'Multi-port USB charging stations & 220V inverter for camera batteries',
            ],
            badge: 'Most Recommended for Safaris',
        },
        {
            name: 'Toyota Land Cruiser Prado 4x4',
            subtitle: 'Premium Comfort for Highway & Off-Road Trails',
            category: 'Luxury SUV / Self-Drive or Chauffeur',
            image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
            seats: '5 - 7 Passengers',
            features: [
                'Full-time 4WD with low-range transfer case for rough terrain',
                'Plush leather interior & dual-zone climate control',
                'Available for verified Self-Drive or with a Chauffeur',
                'Bluetooth sound system, GPS navigation, and dash security',
                'Smooth on Nairobi highways and capable in the national parks',
            ],
            badge: 'Self-Drive Favorite',
        },
        {
            name: 'Safari Minivan (Custom Tour Van)',
            subtitle: 'Economical Group Travel with Pop-Up Roof',
            category: 'Budget-Friendly Safari',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800',
            seats: '7 - 8 Passengers',
            features: [
                'Pop-up roof for game-viewing and photography',
                'Spacious seating with aisle access for all passengers',
                'Fuel-efficient diesel engine ideal for budget-conscious groups',
                'Experienced driver-guide included',
                'Proven reliability in Mara, Nakuru, and Amboseli circuits',
            ],
            badge: 'Best Value for Families',
        },
    ];

    return (
        <section id="fleet" className="py-20 bg-[#F4F6F8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0F17]/5 text-[#0B0F17] text-xs font-semibold uppercase tracking-wider mb-3">
                        <Car className="w-3.5 h-3.5 text-[#D7A04D]" />
                        The GlideX Fleet Advantage
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0B0F17] tracking-tight mb-4">
                        Safari-Spec 4x4 Vehicles Built for Africa’s Wild
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Unlike traditional tour brokers, GlideX operates and verifies real 4x4 safari vehicles. Every vehicle undergoes a rigorous 150-point technical inspection before departure.
                    </p>
                </div>

                {/* Chauffeur vs Self Drive Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#D7A04D] flex items-center justify-center shrink-0">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#0B0F17] mb-1">
                                Option A: Chauffeured Safari Guide
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Relax completely while a licensed Kenya Professional Safari Guide (KPSGA) navigates the park tracks, tracks wildlife movements, and shares expert knowledge of animal behavior.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#D7A04D] flex items-center justify-center shrink-0">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#0B0F17] mb-1">
                                Option B: Self-Drive 4x4 Adventure
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Take control of your own African safari. Rent our fully equipped 4x4 Prados or Land Cruisers with comprehensive insurance, GPS tracking, and 24/7 roadside backup.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fleet Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {fleet.map((vehicle, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative h-56 w-full overflow-hidden">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B0F17]/80 backdrop-blur-md text-[#D7A04D] text-xs font-semibold">
                                        {vehicle.badge}
                                    </div>
                                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0B0F17] text-xs font-bold">
                                        {vehicle.seats}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#D7A04D]">
                                        {vehicle.category}
                                    </span>
                                    <h3 className="text-xl font-display font-bold text-[#0B0F17] mt-1 mb-1">
                                        {vehicle.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-5">
                                        {vehicle.subtitle}
                                    </p>

                                    <div className="space-y-2.5">
                                        {vehicle.features.map((feat, i) => (
                                            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-[#D7A04D] shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-0">
                                <button
                                    onClick={() => onSelectVehicle(vehicle.name)}
                                    className="w-full py-3 rounded-xl border-2 border-[#0B0F17] text-[#0B0F17] hover:bg-[#0B0F17] hover:text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
                                >
                                    Select Vehicle in Enquiry
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
