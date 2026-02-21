/**
 * useCarDetail — React hook for fetching a single car with reviews.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchCarById } from '@/api/cars';
import { fetchReviewsByCarId } from '@/api/reviews';
import { fetchBookingsByCarId } from '@/api/bookings';
import type { FormattedCar, Review, Booking } from '@/types';

export function useCarDetail(carId: string | undefined) {
    const [car, setCar] = useState<FormattedCar | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookings, setBookings] = useState<
        Pick<Booking, 'id' | 'start_date' | 'end_date' | 'status'>[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCarDetail = useCallback(async () => {
        if (!carId) return;

        try {
            setLoading(true);
            setError(null);

            const [carData, reviewsData, bookingsData] = await Promise.all([
                fetchCarById(carId),
                fetchReviewsByCarId(carId),
                fetchBookingsByCarId(carId),
            ]);

            setCar(carData);
            setReviews(reviewsData);
            setBookings(bookingsData);
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error('Failed to load car details')
            );
            console.error('🚨 Fetch Car Detail Error:', err);
        } finally {
            setLoading(false);
        }
    }, [carId]);

    useEffect(() => {
        loadCarDetail();
    }, [loadCarDetail]);

    return {
        car,
        reviews,
        bookings,
        loading,
        error,
        refetch: loadCarDetail,
    };
}
