/**
 * SignDocumentPage — Isolated signing page for /sign/:id
 *
 * Allows a client to view a document, provide their name, draw their
 * signature, and submit it. Completely self-contained – uses only the
 * signing-specific Supabase client and service layer.
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle2, AlertTriangle, FileText, Send } from 'lucide-react';
import SignaturePad from '@/components/signing/SignaturePad';
import DocumentOverlayViewer from '@/components/signing/DocumentOverlayViewer';
import { GLIDEX_HOST_CONTRACT_FIELDS } from '@/lib/signing/contractFieldMap';
import {
    fetchDocumentRequest,
    submitSignature,
    type DocumentRequest,
} from '@/lib/signing/signingService';

type PageState = 'loading' | 'ready' | 'signed' | 'submitting' | 'success' | 'error';

export default function SignDocumentPage() {
    const { id } = useParams<{ id: string }>();
    const [pageState, setPageState] = useState<PageState>('loading');
    const [document, setDocument] = useState<DocumentRequest | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Form state
    const [signerName, setSignerName] = useState('');
    const [consentChecked, setConsentChecked] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});

    // Update a form field value
    const updateFormField = useCallback((fieldId: string, value: string) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
    }, []);

    // Load document on mount
    useEffect(() => {
        if (!id) {
            setErrorMessage('Invalid document link.');
            setPageState('error');
            return;
        }

        (async () => {
            const { data, error } = await fetchDocumentRequest(id);

            if (error && data?.status === 'signed') {
                setDocument(data);
                setPageState('signed');
                return;
            }

            if (error || !data) {
                setErrorMessage(error || 'Document not found.');
                setPageState('error');
                return;
            }

            setDocument(data);
            setPageState('ready');
        })();
    }, [id]);

    // Check if all required overlay fields are filled
    // For overlay fields, check required fields from the contract map
    const overlayFields = GLIDEX_HOST_CONTRACT_FIELDS;
    const areOverlayFieldsValid = overlayFields
        .filter((f) => {
            if (!f.required) return false;
            // Fixed lease fields only required when Option B selected
            if (f.id === 'fixed_monthly_sum_words' || f.id === 'fixed_monthly_sum_figures') {
                return formData['compensation_model'] === 'option_b';
            }
            return true;
        })
        .every((f) => formData[f.id]?.trim());

    // Submit handler
    const handleSubmit = async () => {
        if (!document || !signerName.trim() || !consentChecked || !signatureImage) return;
        if (!areOverlayFieldsValid) return;

        setPageState('submitting');

        // Use the record's actual `id` (not the URL token) for submission
        const { success, error } = await submitSignature({
            documentId: document.id,
            signerName: signerName.trim(),
            signatureImage,
            formData: Object.keys(formData).length > 0 ? formData : undefined,
        });

        if (success) {
            setPageState('success');
        } else {
            setErrorMessage(error || 'Submission failed.');
            setPageState('ready');
        }
    };

    const isFormValid = signerName.trim().length > 0 && consentChecked && signatureImage !== null && areOverlayFieldsValid;

    // ─── Render States ──────────────────────────────────────────

    if (pageState === 'loading') {
        return (
            <PageShell>
                <div className="flex flex-col items-center justify-center gap-4 py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D7A04D]" />
                    <p className="text-sm text-gray-500">Loading document…</p>
                </div>
            </PageShell>
        );
    }

    if (pageState === 'error') {
        return (
            <PageShell>
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Unable to Load Document</h2>
                    <p className="text-sm text-gray-500 max-w-sm">{errorMessage}</p>
                </div>
            </PageShell>
        );
    }

    if (pageState === 'signed') {
        return (
            <PageShell>
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-[#D7A04D]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Already Signed</h2>
                    <p className="text-sm text-gray-500 max-w-sm">
                        This document was signed on{' '}
                        {document?.signed_at
                            ? new Date(document.signed_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                            : 'a previous date'}
                        .
                    </p>
                </div>
            </PageShell>
        );
    }

    if (pageState === 'success') {
        return (
            <PageShell>
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center animate-bounce-once">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Document Signed!</h2>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Thank you, <span className="font-medium text-gray-700">{signerName}</span>. A copy of the signed document has been sent to the relevant parties.
                    </p>
                </div>
            </PageShell>
        );
    }

    // ─── Ready State — Signing Form ─────────────────────────────

    return (
        <PageShell>
            <div className="max-w-4xl mx-auto space-y-8 py-6 sm:py-10">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7A04D]/10 text-[#D7A04D] text-xs font-semibold tracking-wider uppercase">
                        <FileText className="w-3.5 h-3.5" />
                        Document Signing
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
                        Review &amp; Sign
                    </h1>
                    <p className="text-sm text-gray-500">
                        Review the document below, fill in the highlighted fields, then sign at the bottom.
                    </p>
                </div>

                {/* PDF with Overlay Inputs */}
                {document?.document_url && (
                    <DocumentOverlayViewer
                        pdfUrl={document.document_url}
                        fields={overlayFields}
                        formData={formData}
                        onFormDataChange={updateFormField}
                    />
                )}

                {/* Signing Form */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                    {/* Error banner */}
                    {errorMessage && pageState === 'ready' && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {errorMessage}
                        </div>
                    )}

                    {/* Signer Name */}
                    <div className="space-y-2">
                        <label htmlFor="signer-name" className="text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="signer-name"
                            type="text"
                            value={signerName}
                            onChange={(e) => setSignerName(e.target.value)}
                            placeholder="Enter your full legal name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D7A04D]/40 focus:border-[#D7A04D] transition-all"
                            autoComplete="name"
                        />
                    </div>

                    {/* Signature Pad */}
                    <SignaturePad onSignatureChange={setSignatureImage} />

                    {/* Consent Checkbox */}
                    <label
                        htmlFor="consent-checkbox"
                        className="flex items-start gap-3 cursor-pointer group"
                    >
                        <input
                            id="consent-checkbox"
                            type="checkbox"
                            checked={consentChecked}
                            onChange={(e) => setConsentChecked(e.target.checked)}
                            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#D7A04D] focus:ring-[#D7A04D] cursor-pointer"
                        />
                        <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                            I agree to sign this document electronically. I understand that my electronic signature is legally binding.
                        </span>
                    </label>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormValid || pageState === 'submitting'}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[#111111] hover:bg-[#222222] hover:shadow-lg active:scale-[0.98]"
                    >
                        {pageState === 'submitting' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Signing Document…
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Sign Document
                            </>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400">
                    Powered by <span className="font-semibold text-gray-500">GlideX</span> · Secure Electronic Signing
                </p>
            </div>
        </PageShell>
    );
}

// ─── Layout Shell ─────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F4F6F8]">
            {/* Minimal header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">GX</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 tracking-tight">GlideX</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">Secure Signing</span>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6">{children}</main>
        </div>
    );
}
