/**
 * Supabase Signing Client — Isolated for Document Signing Feature
 *
 * This client connects to a SEPARATE Supabase project used exclusively
 * for document signing. It must NOT be imported outside of /sign feature files.
 *
 * Environment variables (set in .env):
 *   VITE_SIGNING_SUPABASE_URL       — Signing project URL
 *   VITE_SIGNING_SUPABASE_ANON_KEY  — Signing project anon key
 */

import { createClient } from '@supabase/supabase-js';

const signingUrl = import.meta.env.VITE_SIGNING_SUPABASE_URL ?? '';
const signingAnonKey = import.meta.env.VITE_SIGNING_SUPABASE_ANON_KEY ?? '';

if (!signingUrl || !signingAnonKey) {
    console.warn(
        '[GlideX Signing] Configuration missing!',
        '\nEnsure VITE_SIGNING_SUPABASE_URL and VITE_SIGNING_SUPABASE_ANON_KEY are set in .env'
    );
}

export const supabaseSigning = createClient(signingUrl, signingAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
