/**
 * CarGrid — Responsive grid layout for car listing cards.
 */

import CarCard from './CarCard';
import { Loader2, CarFront } from 'lucide-react';
import type { FormattedCar } from '@/types';

interface CarGridProps {
    cars: FormattedCar[];
    loading: boolean;
    onCarClick: (car: FormattedCar) => void;
    onClearFilters?: () => void;
}

export default function CarGrid({
    cars,
    loading,
    onCarClick,
    onClearFilters,
}: CarGridProps) {
    // Loading skeleton
    if (loading && cars.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
                    >
                        <div className="aspect-[16/10] bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                            <div className="flex gap-2 mt-2">
                                <div className="h-5 bg-gray-100 rounded-full w-16" />
                                <div className="h-5 bg-gray-100 rounded-full w-14" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (!loading && cars.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                    <CarFront className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-[#0B0F17] mb-2">
                    No cars found
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                    Try adjusting your search, category, or date filters to find available
                    cars.
                </p>
                {onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="btn-primary text-sm"
                    >
                        Clear All Filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Refresh indicator */}
            {loading && cars.length > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs text-gray-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Refreshing…
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {cars.map((car) => (
                    <CarCard key={car.id} car={car} onClick={() => onCarClick(car)} />
                ))}
            </div>
        </div>
    );
}
