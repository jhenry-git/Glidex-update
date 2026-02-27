/**
 * Signing Service — Client-side service layer for the document signing feature.
 *
 * Handles fetching document requests and submitting signatures.
 * Uses the isolated signing Supabase client only.
 *
 * IMPORTANT: The URL contains a `signing_token`, NOT the record `id`.
 * The GSign admin app generates links like /sign/{signing_token}.
 * We query by `signing_token` to find the record, then use the
 * record's `id` for submission to the Edge Function.
 */

import { supabaseSigning } from './supabaseSigningClient';

export interface DocumentRequest {
    id: string;
    admin_email: string;
    client_email: string;
    document_url: string;
    original_filename: string | null;
    signing_token: string;
    status: 'pending' | 'signed';
    created_at: string;
    signed_at: string | null;
}

export interface SignaturePayload {
    documentId: string; // This is the record's `id`, not the signing_token
    signerName: string;
    signatureImage: string; // base64 PNG
}

/**
 * Fetch a document request by its signing_token and validate it's ready for signing.
 * The token comes from the URL: /sign/{signing_token}
 */
export async function fetchDocumentRequest(
    signingToken: string
): Promise<{ data: DocumentRequest | null; error: string | null }> {
    try {
        const { data, error } = await supabaseSigning
            .from('document_requests')
            .select('*')
            .eq('signing_token', signingToken)
            .single();

        if (error || !data) {
            console.error('[GlideX Signing] Fetch error:', error?.message);
            return { data: null, error: 'Document not found.' };
        }

        const doc = data as DocumentRequest;

        if (doc.status === 'signed') {
            return { data: doc, error: 'This document has already been signed.' };
        }

        if (doc.status !== 'pending') {
            return { data: null, error: 'This document is no longer available for signing.' };
        }

        return { data: doc, error: null };
    } catch (err) {
        console.error('[GlideX Signing] Unexpected error:', err);
        return { data: null, error: 'Failed to load document. Please try again.' };
    }
}

/**
 * Submit a signature to the process-signing Edge Function.
 * Uses the record's actual `id`, not the signing_token.
 */
export async function submitSignature(
    payload: SignaturePayload
): Promise<{ success: boolean; error: string | null }> {
    try {
        const signingUrl = import.meta.env.VITE_SIGNING_SUPABASE_URL;

        const response = await fetch(
            `${signingUrl}/functions/v1/process-signing`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_SIGNING_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            return {
                success: false,
                error: body.error || 'Failed to submit signature. Please try again.',
            };
        }

        return { success: true, error: null };
    } catch {
        return {
            success: false,
            error: 'Network error. Please check your connection and try again.',
        };
    }
}

