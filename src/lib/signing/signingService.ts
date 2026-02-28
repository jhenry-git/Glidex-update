/**
 * Signing Service — Client-side service layer for the document signing feature.
 *
 * Handles fetching document requests, submitting signatures,
 * auto-saving form progress, and audit trail logging.
 *
 * Uses the isolated signing Supabase client only.
 *
 * IMPORTANT: The URL contains a `signing_token`, NOT the record `id`.
 * The GSign admin app generates links like /sign/{signing_token}.
 * We query by `signing_token` to find the record, then use the
 * record's `id` for submission to the Edge Function.
 */

import { supabaseSigning } from './supabaseSigningClient';

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'select' | 'checkbox' | 'initials' | 'signature' | 'radio';
    required: boolean;
    options?: string[]; // for select type
    placeholder?: string;
    group?: string;
    page?: number;
    topPct?: number;
    leftPct?: number;
    widthPct?: number;
    fontSize?: number;
}

export interface DocumentRequest {
    id: string;
    admin_email: string;
    client_email: string;
    document_url: string;
    original_filename: string | null;
    signing_token: string;
    status: 'pending' | 'signed' | 'expired' | 'cancelled';
    created_at: string;
    signed_at: string | null;
    locked_at: string | null;
    form_fields: FormField[] | null;
    form_field_responses: Record<string, string> | null;
    document_hash: string | null;
}

export interface SignaturePayload {
    documentId: string; // This is the record's `id`, not the signing_token
    signerName: string;
    signatureImage: string; // base64 PNG
    signatureType: 'draw' | 'typed' | 'uploaded';
    formData?: Record<string, string>; // filled form field values
}

// ─── Fetch Document Request ───────────────────────────────────

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

        if (doc.locked_at) {
            return { data: doc, error: 'This document has been locked.' };
        }

        if (doc.status !== 'pending') {
            return { data: null, error: 'This document is no longer available for signing.' };
        }

        // Log document view
        logAuditEvent(doc.id, 'viewed').catch(() => { });

        return { data: doc, error: null };
    } catch (err) {
        console.error('[GlideX Signing] Unexpected error:', err);
        return { data: null, error: 'Failed to load document. Please try again.' };
    }
}

// ─── Submit Signature ─────────────────────────────────────────

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

// ─── Auto-Save Form Progress ──────────────────────────────────

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced auto-save of form field responses.
 * Writes to `form_field_responses` JSONB column on `document_requests`.
 */
export function saveFormProgress(
    documentId: string,
    formData: Record<string, string>,
    onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void
): void {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
        try {
            onSaveStatus?.('saving');

            const { error } = await supabaseSigning
                .from('document_requests')
                .update({ form_field_responses: formData })
                .eq('id', documentId);

            if (error) {
                console.error('[GlideX Signing] Auto-save error:', error.message);
                onSaveStatus?.('error');
            } else {
                onSaveStatus?.('saved');
                // Log progress save
                logAuditEvent(documentId, 'progress_saved', {
                    fieldCount: Object.keys(formData).length,
                }).catch(() => { });
            }
        } catch {
            onSaveStatus?.('error');
        }
    }, 1500); // 1.5 second debounce
}

// ─── Audit Trail Logging ──────────────────────────────────────

/**
 * Log an audit event for a document.
 */
export async function logAuditEvent(
    documentId: string,
    action: 'viewed' | 'field_updated' | 'progress_saved' | 'signed' | 'locked' | 'downloaded',
    metadata: Record<string, unknown> = {}
): Promise<void> {
    try {
        // Capture client info
        const ip = await getClientIP();
        const userAgent = navigator.userAgent;

        await supabaseSigning.from('signing_audit_log').insert({
            document_id: documentId,
            action,
            ip_address: ip,
            user_agent: userAgent,
            metadata,
        });
    } catch (err) {
        console.warn('[GlideX Signing] Audit log failed:', err);
    }
}

/**
 * Attempt to get client IP via a free API. Falls back to 'unknown'.
 */
async function getClientIP(): Promise<string> {
    try {
        const res = await fetch('https://api.ipify.org?format=json', {
            signal: AbortSignal.timeout(3000),
        });
        const data = await res.json();
        return data.ip || 'unknown';
    } catch {
        return 'unknown';
    }
}

// ─── Utilities ────────────────────────────────────────────────

/**
 * Calculate form completion percentage.
 */
export function calculateCompletionPercentage(
    fields: FormField[],
    formData: Record<string, string>,
    compensationModel?: string
): { percentage: number; filled: number; total: number } {
    const requiredFields = fields.filter((f) => {
        if (!f.required) return false;
        // Fixed lease fields only required when Option B selected
        if (f.id === 'fixed_monthly_sum_words' || f.id === 'fixed_monthly_sum_figures') {
            return compensationModel === 'option_b';
        }
        return true;
    });

    const filled = requiredFields.filter((f) => formData[f.id]?.trim()).length;
    const total = requiredFields.length;
    const percentage = total === 0 ? 100 : Math.round((filled / total) * 100);

    return { percentage, filled, total };
}

/**
 * Get list of unfilled required fields.
 */
export function getUnfilledFields(
    fields: FormField[],
    formData: Record<string, string>,
    compensationModel?: string
): FormField[] {
    return fields.filter((f) => {
        if (!f.required) return false;
        if (f.id === 'fixed_monthly_sum_words' || f.id === 'fixed_monthly_sum_figures') {
            return compensationModel === 'option_b' && !formData[f.id]?.trim();
        }
        return !formData[f.id]?.trim();
    });
}
