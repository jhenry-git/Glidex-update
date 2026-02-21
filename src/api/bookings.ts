/**
 * Bookings API — Access booking data for car availability display
 */

import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types';

/**
 * Check availability for a specific car in a date range.
 */
export async function checkCarAvailability(
    carId: string,
    startDate: string,
    endDate: string
): Promise<boolean> {
    const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('car_id', carId)
        .in('status', ['pending', 'approved', 'active'])
        .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (error) throw error;
    return (data?.length ?? 0) === 0;
}

/**
 * Fetch bookings for a car (public view — for availability display).
 */
export async function fetchBookingsByCarId(
    carId: string
): Promise<Pick<Booking, 'id' | 'start_date' | 'end_date' | 'status'>[]> {
    const { data, error } = await supabase
        .from('bookings')
        .select('id, start_date, end_date, status')
        .eq('car_id', carId)
        .in('status', ['approved', 'active'])
        .order('start_date', { ascending: true });

    if (error) throw error;
    return data ?? [];
}
