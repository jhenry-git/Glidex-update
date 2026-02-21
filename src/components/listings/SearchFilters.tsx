/**
 * SearchFilters — Search bar and category/sort filters for car listings.
 * Mirrors mobile app's search + CategoryFilter + sort toggles.
 */

import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { CarFilters, SortType } from '@/types';

const CATEGORIES = [
    'All',
    'Automatic',
    'Manual',
    'Hybrid',
    'Petrol',
    'Diesel',
    'Electric',
];

const SORT_OPTIONS: { value: SortType; label: string; icon: string }[] = [
    { value: 'newest', label: 'Newest', icon: '✨' },
    { value: 'topRated', label: 'Top Rated', icon: '⭐' },
    { value: 'priceLow', label: 'Price: Low', icon: '↑' },
    { value: 'priceHigh', label: 'Price: High', icon: '↓' },
];

interface SearchFiltersProps {
    filters: CarFilters;
    onChange: (filters: CarFilters) => void;
    totalCount: number;
    filteredCount: number;
}

export default function SearchFilters({
    filters,
    onChange,
    totalCount,
    filteredCount,
}: SearchFiltersProps) {
    const hasActiveFilters =
        filters.searchQuery ||
        (filters.category && filters.category !== 'All') ||
        filters.sortType !== 'newest';

    const updateFilter = (partial: Partial<CarFilters>) =>
        onChange({ ...filters, ...partial });

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    id="search-cars"
                    placeholder="Search by brand, model, location, or host…"
                    value={filters.searchQuery ?? ''}
                    onChange={(e) => updateFilter({ searchQuery: e.target.value })}
                    className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0B0F17] placeholder:text-gray-400 focus:outline-none focus:border-[#D7A04D] focus:ring-1 focus:ring-[#D7A04D]/30 transition-colors"
                />
                {filters.searchQuery && (
                    <button
                        onClick={() => updateFilter({ searchQuery: '' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <X className="w-3 h-3 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Categories + Sort + Count */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => updateFilter({ category: cat })}
                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${(filters.category ?? 'All') === cat
                                    ? 'bg-[#0B0F17] text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-6 bg-gray-200" />

                {/* Sort buttons */}
                <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 mr-1" />
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => updateFilter({ sortType: opt.value })}
                            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${filters.sortType === opt.value
                                    ? 'bg-[#D7A04D]/10 text-[#B8862D] border border-[#D7A04D]/30'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {opt.icon} {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count + clear */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                    Showing{' '}
                    <span className="font-semibold text-[#0B0F17]">
                        {filteredCount}
                    </span>{' '}
                    {filteredCount !== totalCount && (
                        <>
                            of{' '}
                            <span className="font-semibold text-[#0B0F17]">{totalCount}</span>{' '}
                        </>
                    )}
                    car{filteredCount !== 1 ? 's' : ''}
                </p>

                {hasActiveFilters && (
                    <button
                        onClick={() =>
                            onChange({
                                searchQuery: '',
                                category: 'All',
                                sortType: 'newest',
                            })
                        }
                        className="text-xs text-[#D7A04D] hover:text-[#B8862D] font-medium transition-colors"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
