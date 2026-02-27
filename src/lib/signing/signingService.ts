/**
 * Signing Service — Client-side service layer for the document signing feature.
 *
 * Handles fetching document requests and submitting signatures.
 * Uses the isolated signing Supabase client only.
 */

import { supabaseSigning } from './supabaseSigningClient';

export interface DocumentRequest {
    id: string;
    admin_email: string;
    client_email: string | null;
    document_url: string;
    status: 'pending' | 'signed' | 'expired' | 'cancelled';
    created_at: string;
    signed_at: string | null;
}

export interface SignaturePayload {
    documentId: string;
    signerName: string;
    signatureImage: string; // base64 PNG
}

/**
 * Fetch a document request by ID and validate it's ready for signing.
 */
export async function fetchDocumentRequest(
    id: string
): Promise<{ data: DocumentRequest | null; error: string | null }> {
    try {
        const { data, error } = await supabaseSigning
            .from('document_requests')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
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
    } catch {
        return { data: null, error: 'Failed to load document. Please try again.' };
    }
}

/**
 * Submit a signature to the process-signing Edge Function.
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
