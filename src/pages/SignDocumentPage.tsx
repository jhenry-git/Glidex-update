/**
 * SignDocumentPage — Smart Document Review, Edit & Sign Page
 *
 * Complete redesign with step-based workflow:
 *   1. Review — View the full document
 *   2. Fill — Complete all required fields with auto-save
 *   3. Sign — Draw, type, or upload signature + consent
 *   4. Done — Success confirmation
 *
 * Features:
 *   - Progress tracking with stepper UI
 *   - Auto-save with debounced writes
 *   - Field validation with error highlighting
 *   - Multi-mode signature capture
 *   - IP/device logging on submission
 *   - Mobile-first responsive layout
 */

import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Loader2,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Send,
    ArrowRight,
    ArrowLeft,
    Shield,
    Lock,
    Eye,
} from 'lucide-react';
import SignatureSelector from '@/components/signing/SignatureSelector';
import SigningProgress, { type SigningStep, type SaveStatus } from '@/components/signing/SigningProgress';
import DocumentOverlayViewer from '@/components/signing/DocumentOverlayViewer';
import { FieldGroupRenderer } from '@/components/signing/FieldRenderer';
import { GLIDEX_HOST_CONTRACT_FIELDS, type OverlayField } from '@/lib/signing/contractFieldMap';
import {
    fetchDocumentRequest,
    submitSignature,
    saveFormProgress,
    calculateCompletionPercentage,
    getUnfilledFields,
    type DocumentRequest,
    type FormField,
} from '@/lib/signing/signingService';

type PageState = 'loading' | 'ready' | 'signed' | 'submitting' | 'success' | 'error';

export default function SignDocumentPage() {
    const { id } = useParams<{ id: string }>();
    const [pageState, setPageState] = useState<PageState>('loading');
    const [docRequest, setDocRequest] = useState<DocumentRequest | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Step-based workflow
    const [currentStep, setCurrentStep] = useState<SigningStep>('review');

    // Form state
    const [signerName, setSignerName] = useState('');
    const [consentChecked, setConsentChecked] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [signatureType, setSignatureType] = useState<'draw' | 'typed' | 'uploaded'>('draw');
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [showFieldErrors, setShowFieldErrors] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

    // Get fields — use form_fields from DB if available, else fallback to static map
    const overlayFields: FormField[] = useMemo(() => {
        if (docRequest?.form_fields && docRequest.form_fields.length > 0) {
            return docRequest.form_fields;
        }
        return GLIDEX_HOST_CONTRACT_FIELDS as FormField[];
    }, [docRequest]);

    // Completion tracking
    const completion = useMemo(
        () => calculateCompletionPercentage(overlayFields, formData, formData['compensation_model']),
        [overlayFields, formData]
    );

    const unfilledFields = useMemo(
        () => getUnfilledFields(overlayFields, formData, formData['compensation_model']),
        [overlayFields, formData]
    );

    // Update a form field value + trigger auto-save
    const updateFormField = useCallback(
        (fieldId: string, value: string) => {
            setFormData((prev) => {
                const next = { ...prev, [fieldId]: value };
                // Auto-save to Supabase
                if (docRequest?.id) {
                    saveFormProgress(docRequest.id, next, (status) => {
                        if (status === 'saving') setSaveStatus('saving');
                        else if (status === 'saved') {
                            setSaveStatus('saved');
                            setTimeout(() => setSaveStatus('idle'), 3000);
                        } else {
                            setSaveStatus('error');
                        }
                    });
                }
                return next;
            });
        },
        [docRequest?.id]
    );

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
                setDocRequest(data);
                setPageState('signed');
                return;
            }

            if (error || !data) {
                setErrorMessage(error || 'Document not found.');
                setPageState('error');
                return;
            }

            setDocRequest(data);

            // Restore saved form progress
            if (data.form_field_responses && Object.keys(data.form_field_responses).length > 0) {
                setFormData(data.form_field_responses);
            }

            setPageState('ready');
        })();
    }, [id]);

    // Step navigation
    const goToNextStep = () => {
        if (currentStep === 'review') {
            setCurrentStep('fill');
        } else if (currentStep === 'fill') {
            // Validate fields before proceeding to sign
            if (completion.percentage < 100) {
                setShowFieldErrors(true);
                // Scroll to first unfilled field
                if (unfilledFields.length > 0) {
                    scrollToField(unfilledFields[0].id);
                }
                return;
            }
            setShowFieldErrors(false);
            setCurrentStep('sign');
        }
    };

    const goToPrevStep = () => {
        if (currentStep === 'fill') setCurrentStep('review');
        else if (currentStep === 'sign') setCurrentStep('fill');
    };

    const scrollToField = (fieldId: string) => {
        const el = window.document.getElementById(`field-${fieldId}`) ||
            window.document.getElementById(`overlay-${fieldId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Submit handler
    const handleSubmit = async () => {
        if (!docRequest || !signerName.trim() || !consentChecked || !signatureImage) return;
        if (completion.percentage < 100) return;

        setPageState('submitting');

        const { success, error } = await submitSignature({
            documentId: docRequest.id,
            signerName: signerName.trim(),
            signatureImage,
            signatureType,
            formData: Object.keys(formData).length > 0 ? formData : undefined,
        });

        if (success) {
            setCurrentStep('done');
            setPageState('success');
        } else {
            setErrorMessage(error || 'Submission failed.');
            setPageState('ready');
        }
    };

    const isSignFormValid =
        signerName.trim().length > 0 &&
        consentChecked &&
        signatureImage !== null &&
        completion.percentage === 100;

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
                        {docRequest?.signed_at
                            ? new Date(docRequest.signed_at).toLocaleDateString('en-US', {
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
                <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center animate-bounce-once">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Document Signed!</h2>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Thank you, <span className="font-medium text-gray-700">{signerName}</span>.
                            A copy of the signed document has been sent to the relevant parties.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                        <Lock className="w-3 h-3" />
                        Document has been securely locked
                    </div>
                </div>
            </PageShell>
        );
    }

    // ─── Ready State — Step-Based Workflow ────────────────────────

    return (
        <PageShell>
            <div className="max-w-4xl mx-auto space-y-6 py-6 sm:py-10">
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
                        {currentStep === 'review' && 'Review the document below, then proceed to fill in the required fields.'}
                        {currentStep === 'fill' && 'Complete all required fields. Your progress is saved automatically.'}
                        {currentStep === 'sign' && 'All fields completed! Add your signature to finalize.'}
                    </p>
                </div>

                {/* Progress Stepper */}
                <SigningProgress
                    currentStep={currentStep}
                    completionPercentage={completion.percentage}
                    filledCount={completion.filled}
                    totalCount={completion.total}
                    saveStatus={saveStatus}
                    unfilledFields={unfilledFields}
                    onScrollToField={scrollToField}
                />

                {/* ─── Step: Review ───────────────────────────────── */}
                {currentStep === 'review' && (
                    <div className="space-y-6">
                        {/* Document Viewer */}
                        {docRequest?.document_url && (
                            <DocumentOverlayViewer
                                pdfUrl={docRequest.document_url}
                                fields={overlayFields as OverlayField[]}
                                formData={formData}
                                onFormDataChange={updateFormField}
                            />
                        )}

                        {/* Next Button */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={goToNextStep}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#D7A04D] hover:bg-[#c59040] shadow-lg shadow-[#D7A04D]/20 transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
                            >
                                <Eye className="w-4 h-4" />
                                I've Reviewed — Continue to Fill Fields
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── Step: Fill Fields ──────────────────────────── */}
                {currentStep === 'fill' && (
                    <div className="space-y-6">
                        {/* PDF with Overlay Inputs */}
                        {docRequest?.document_url && (
                            <DocumentOverlayViewer
                                pdfUrl={docRequest.document_url}
                                fields={overlayFields as OverlayField[]}
                                formData={formData}
                                onFormDataChange={updateFormField}
                                showFieldErrors={showFieldErrors}
                            />
                        )}

                        {/* Smart Form Panel */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-[#D7A04D]/10 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-[#D7A04D]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Document Fields</h2>
                                    <p className="text-xs text-gray-500">Complete all required fields below</p>
                                </div>
                            </div>

                            <FieldGroupRenderer
                                fields={overlayFields}
                                formData={formData}
                                onFormDataChange={updateFormField}
                                showErrors={showFieldErrors}
                                compensationModel={formData['compensation_model']}
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={goToPrevStep}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Review
                            </button>
                            <button
                                type="button"
                                onClick={goToNextStep}
                                disabled={completion.percentage < 100}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#D7A04D] hover:bg-[#c59040] shadow-lg shadow-[#D7A04D]/20 transition-all duration-200 hover:shadow-xl active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Continue to Sign
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── Step: Sign ─────────────────────────────────── */}
                {currentStep === 'sign' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                            {/* Completion check */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <span>All {completion.total} required fields completed. Ready to sign!</span>
                            </div>

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
                                    Full Legal Name
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

                            {/* Signature Selector (Draw / Type / Upload) */}
                            <SignatureSelector
                                signerName={signerName}
                                onSignatureChange={(sig, type) => {
                                    setSignatureImage(sig);
                                    setSignatureType(type);
                                }}
                            />

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
                                    I agree to sign this document electronically. I understand that my electronic
                                    signature is legally binding.
                                </span>
                            </label>

                            {/* Security Notice */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-4 py-2.5 rounded-xl">
                                <Shield className="w-3.5 h-3.5" />
                                Your signature is encrypted and your IP address is logged for verification.
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!isSignFormValid || pageState === 'submitting'}
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

                        {/* Back button */}
                        <div className="flex justify-start">
                            <button
                                type="button"
                                onClick={goToPrevStep}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Fields
                            </button>
                        </div>
                    </div>
                )}

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
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">GX</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 tracking-tight">
                            GlideX
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Lock className="w-3 h-3" />
                        <span className="font-mono">Secure Signing</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6">{children}</main>
        </div>
    );
}
