import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase
        .from('cars')
        .select(`
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
    `)
        .limit(1);

    if (error) {
        console.error('ERROR RESPONSE:', JSON.stringify(error, null, 2));
    } else {
        console.log('SUCCESS:', data);
    }
}
test();
