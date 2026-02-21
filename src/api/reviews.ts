/**
 * Reviews API — Fetch reviews for car listings
 * Mirrors: GlideXP-1.0.4/src/components/CarCard.jsx fetchReviews()
 */

import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';

/**
 * Fetch all reviews for a specific car.
 */
export async function fetchReviewsByCarId(carId: string): Promise<Review[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select(
            `
      id,
      car_id,
      reviewer_id,
      rating,
      comment,
      created_at,
      booking_id
    `
        )
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
}

/**
 * Calculate average rating from reviews.
 */
export function calculateAverageRating(reviews: Review[]): {
    average: number;
    count: number;
} {
    if (reviews.length === 0) return { average: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return {
        average: Number((total / reviews.length).toFixed(1)),
        count: reviews.length,
    };
}
