/**
 * useCars — React hook for fetching and filtering car listings.
 * Wraps the shared API layer for use in React components.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCars } from '@/api/cars';
import { filterAndSortCars } from '@/api/cars';
import type { FormattedCar, CarFilters } from '@/types';

export function useCars(options?: { startDate?: string; endDate?: string }) {
    const [allCars, setAllCars] = useState<FormattedCar[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState<CarFilters>({
        searchQuery: '',
        category: 'All',
        sortType: 'newest',
    });

    const loadCars = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCars(options);
            setAllCars(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load cars'));
            console.error('🚨 Fetch Cars Error:', err);
        } finally {
            setLoading(false);
        }
    }, [options]);

    useEffect(() => {
        loadCars();
    }, [loadCars]);

    // Client-side filtering and sorting
    const cars = useMemo(
        () => filterAndSortCars(allCars, filters),
        [allCars, filters]
    );

    return {
        cars,
        allCars,
        loading,
        error,
        filters,
        setFilters,
        refetch: loadCars,
        totalCount: allCars.length,
        filteredCount: cars.length,
    };
}
