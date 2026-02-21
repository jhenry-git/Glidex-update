import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const carId = '4703c19b-6f66-4d87-8c17-b1fbcb5fe76b';

async function test() {
    const { data: revData, error: revErr } = await supabase
        .from('reviews')
        .select('id, car_id, reviewer_id, rating, comment, created_at, booking_id')
        .eq('car_id', carId)
        .order('created_at', { ascending: false });

    console.log('Reviews Error:', JSON.stringify(revErr, null, 2));

    const { data: bookData, error: bookErr } = await supabase
        .from('bookings')
        .select('id, start_date, end_date, status')
        .eq('car_id', carId)
        .in('status', ['approved', 'active'])
        .order('start_date', { ascending: true });

    console.log('Bookings Error:', JSON.stringify(bookErr, null, 2));
}
test();
