/**
 * Cars API — Platform-agnostic data access layer
 * 
 * Replicates the exact query structure from the mobile app's
 * HomeScreen.fetchCars() for cross-platform data consistency.
 */

import { supabase } from '@/lib/supabase';
import type { FormattedCar, CarFilters, SortType } from '@/types';

/**
 * Fetch all available cars with host profiles and ratings.
 * Mirrors: GlideXP-1.0.4/src/screens/HomeScreen.jsx lines 294-374
 */
export async function fetchCars(options?: {
    startDate?: string;
    endDate?: string;
}): Promise<FormattedCar[]> {
    let carIds: string[] = [];

    // 1. Optional date-range availability check via RPC
    if (options?.startDate && options?.endDate) {
        const { data: availableCarIds, error } = await supabase.rpc(
            'get_available_cars',
            {
                start_d: options.startDate,
                end_d: options.endDate,
            }
        );

        if (error) throw error;
        carIds = availableCarIds?.map((c: { id: string }) => c.id) ?? [];
        if (carIds.length === 0) return [];
    }

    // 2. Main query with joins — identical to mobile app
    let query = supabase
        .from('cars')
        .select(
            `
      id,
      name,
      brand,
      model,
      price,
      location,
      transmission,
      fuel,
      engine_cc,
      capacity,
      image_urls,
      is_available,
      host_id,
      created_at,
      description,
      profiles!host_id (
        id,
        name,
        email,
        phone,
        is_verified
      ),
      car_ratings (
        avg_rating,
        review_count
      )
    `
        )
        .eq('is_available', true)
        .order('created_at', { ascending: false });

    // 3. Filter by available IDs if date range was specified
    if (carIds.length > 0) {
        query = query.in('id', carIds);
    }

    const { data, error: carError } = await query;
    if (carError) throw carError;

    return formatCars(data ?? []);
}

/**
 * Fetch a single car by ID with full details.
 */
export async function fetchCarById(id: string): Promise<FormattedCar | null> {
    const { data, error } = await supabase
        .from('cars')
        .select(
            `
      id,
      name,
      brand,
      model,
      price,
      location,
      transmission,
      fuel,
      engine_cc,
      capacity,
      image_urls,
      is_available,
      host_id,
      created_at,
      description,
      profiles!host_id (
        id,
        name,
        email,
        phone,
        is_verified,
        avatar_url
      ),
      car_ratings (
        avg_rating,
        review_count
      )
    `
        )
        .eq('id', id)
        .single();

    if (error) throw error;
    if (!data) return null;

    return formatCars([data])[0];
}

/**
 * Filter and sort cars client-side.
 * Mirrors: GlideXP-1.0.4/src/screens/HomeScreen.jsx lines 447-480
 */
export function filterAndSortCars(
    cars: FormattedCar[],
    filters: CarFilters
): FormattedCar[] {
    let result = [...cars];

    // Sort
    const sortType: SortType = filters.sortType ?? 'newest';
    switch (sortType) {
        case 'topRated':
            result.sort((a, b) =>
                b.rating !== a.rating ? b.rating - a.rating : b.reviews - a.reviews
            );
            break;
        case 'priceLow':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'priceHigh':
            result.sort((a, b) => b.price - a.price);
            break;
        default:
            result.sort(
                (a, b) =>
                    new Date(b.created_at ?? 0).getTime() -
                    new Date(a.created_at ?? 0).getTime()
            );
    }

    // Filter by category
    if (filters.category && filters.category !== 'All') {
        const cat = filters.category.toLowerCase();
        result = result.filter(
            (car) =>
                car.transmission?.toLowerCase() === cat ||
                car.fuel?.toLowerCase() === cat
        );
    }

    // Filter by search query
    if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        result = result.filter(
            (car) =>
                car.name.toLowerCase().includes(query) ||
                `${car.brand} ${car.model}`.toLowerCase().includes(query) ||
                car.location.toLowerCase().includes(query) ||
                car.hostName.toLowerCase().includes(query)
        );
    }

    return result;
}

/**
 * Format raw Supabase car data into display-ready objects.
 * Mirrors: GlideXP-1.0.4/src/screens/HomeScreen.jsx lines 353-365
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCars(raw: any[]): FormattedCar[] {
    return raw.map((car) => {
        const ratingData = car.car_ratings?.[0];
        return {
            ...car,
            hostName: car.profiles?.name ?? 'Unknown Host',
            hostEmail: car.profiles?.email ?? '',
            hostPhone: car.profiles?.phone ?? '',
            isVerified: car.profiles?.is_verified ?? false,
            isNew:
                new Date(car.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            rating: ratingData?.avg_rating ?? 0,
            reviews: ratingData?.review_count ?? 0,
        };
    });
}
