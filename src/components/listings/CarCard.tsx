/**
 * CarCard — Web version of the mobile CarCard component.
 * Displays car listing with image, details, rating, and verified badge.
 */

import { Star, MapPin, Fuel, Settings, Users, BadgeCheck, Sparkles } from 'lucide-react';
import type { FormattedCar } from '@/types';

interface CarCardProps {
    car: FormattedCar;
    onClick?: () => void;
}

export default function CarCard({ car, onClick }: CarCardProps) {
    const imageUrl =
        car.image_urls && car.image_urls.length > 0
            ? car.image_urls[0]
            : '/placeholder-car.jpg';

    return (
        <div
            id={`car-card-${car.id}`}
            onClick={onClick}
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md"
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={`Rent ${car.brand} ${car.model} in ${car.location}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* New badge */}
                {car.isNew && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        NEW
                    </div>
                )}

                {/* Verified badge */}
                {car.isVerified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                    </div>
                )}

                {/* Price overlay */}
                <div className="absolute bottom-3 right-3 bg-[#0B0F17]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl">
                    <span className="text-sm font-bold">KES {car.price.toLocaleString()}</span>
                    <span className="text-[10px] text-white/70 ml-0.5">/day</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-[#0B0F17] text-[15px] leading-tight line-clamp-1">
                        {car.brand} {car.model}
                    </h3>
                    {car.rating > 0 && (
                        <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-[#0B0F17]">
                                {Number(car.rating).toFixed(1)}
                            </span>
                            <span className="text-[10px] text-gray-400">({car.reviews})</span>
                        </div>
                    )}
                </div>

                {/* Name subtitle */}
                <p className="text-xs text-gray-500 mb-2.5">{car.name}</p>

                {/* Location */}
                <div className="flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 line-clamp-1">{car.location}</span>
                </div>

                {/* Specs row */}
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    {car.transmission && (
                        <div className="flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            <span>{car.transmission}</span>
                        </div>
                    )}
                    {car.fuel && (
                        <div className="flex items-center gap-1">
                            <Fuel className="w-3 h-3" />
                            <span>{car.fuel}</span>
                        </div>
                    )}
                    {car.capacity && (
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{car.capacity}</span>
                        </div>
                    )}
                </div>

                {/* Host name */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D7A04D] to-[#B8862D] flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white">
                            {car.hostName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                        Hosted by <span className="font-medium text-gray-700">{car.hostName}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
