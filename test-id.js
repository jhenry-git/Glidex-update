import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('cars')
    .select('id, name')
    .eq('id', '4703c19b-6f66-4d87-8c17-b1fbcb5fe76b');

  console.log('Result:', data, error);
}
test();
