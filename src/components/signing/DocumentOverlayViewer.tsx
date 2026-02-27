/**
 * DocumentOverlayViewer — Renders a PDF with absolute-positioned input overlays.
 *
 * Architecture:
 *   - Uses react-pdf to render each page as a canvas
 *   - Each page gets a per-page overlay div with positioned inputs
 *   - Coordinates are percentage-based (from contractFieldMap)
 *   - Scale factor is captured from rendered page dimensions
 *   - Compensation model uses radio mutual exclusion
 *
 * Props:
 *   - pdfUrl: URL of the PDF to render
 *   - fields: OverlayField[] config from contractFieldMap
 *   - formData: current form state
 *   - onFormDataChange: callback to update form state
 */

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { type OverlayField, getFieldsForPage } from '@/lib/signing/contractFieldMap';
import { FileText, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

// Configure PDF.js worker — must match the exact pdfjs-dist version bundled with react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentOverlayViewerProps {
    pdfUrl: string;
    fields: OverlayField[];
    formData: Record<string, string>;
    onFormDataChange: (fieldId: string, value: string) => void;
}

export default function DocumentOverlayViewer({
    pdfUrl,
    fields,
    formData,
    onFormDataChange,
}: DocumentOverlayViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [collapsedPages, setCollapsedPages] = useState<Set<number>>(new Set());

    // Fixed width for consistent rendering
    const PAGE_WIDTH = 800;

    const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
        setNumPages(n);
        setPdfError(null);
    }, []);

    const onDocumentLoadError = useCallback(() => {
        setPdfError('Failed to load PDF document.');
    }, []);

    const togglePage = (page: number) => {
        setCollapsedPages((prev) => {
            const next = new Set(prev);
            if (next.has(page)) next.delete(page);
            else next.add(page);
            return next;
        });
    };

    // Check if Option B is selected (for conditional fixed lease fields)
    const isOptionB = formData['compensation_model'] === 'option_b';

    if (pdfError) {
        return (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">
                <p className="text-sm text-red-600">{pdfError}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D7A04D]" />
                        <p className="text-sm text-gray-500">Loading document…</p>
                    </div>
                }
            >
                {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
                    const pageFields = getFieldsForPage(fields, pageNum);
                    const isCollapsed = collapsedPages.has(pageNum);
                    const hasFields = pageFields.length > 0;

                    return (
                        <div key={pageNum} className="mb-6">
                            {/* Page header */}
                            <div
                                className={`flex items-center justify-between px-4 py-2.5 rounded-t-2xl border border-b-0 border-gray-200 ${hasFields
                                    ? 'bg-amber-50 cursor-pointer hover:bg-amber-100/80'
                                    : 'bg-gray-50'
                                    } transition-colors`}
                                onClick={() => hasFields && togglePage(pageNum)}
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-medium text-gray-600">
                                        Page {pageNum} of {numPages}
                                    </span>
                                    {hasFields && (
                                        <span className="text-xs bg-[#D7A04D]/15 text-[#D7A04D] px-2 py-0.5 rounded-full font-medium">
                                            {pageFields.length} field{pageFields.length > 1 ? 's' : ''} to fill
                                        </span>
                                    )}
                                </div>
                                {hasFields && (
                                    <button className="text-gray-400 hover:text-gray-600" type="button">
                                        {isCollapsed ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronUp className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Page content */}
                            {!isCollapsed && (
                                <div className="relative border border-gray-200 rounded-b-2xl overflow-hidden bg-white shadow-sm">
                                    {/* PDF Page Renderer */}
                                    <Page
                                        pageNumber={pageNum}
                                        width={PAGE_WIDTH}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />

                                    {/* Overlay Input Layer — positioned per-page */}
                                    {hasFields && (
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{ width: PAGE_WIDTH }}
                                        >
                                            {pageFields.map((field) => (
                                                <OverlayInput
                                                    key={field.id}
                                                    field={field}
                                                    value={formData[field.id] || ''}
                                                    onChange={onFormDataChange}
                                                    compensationModel={formData['compensation_model']}
                                                    isOptionB={isOptionB}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Collapsed state */}
                            {isCollapsed && (
                                <div className="border border-gray-200 border-t-0 rounded-b-2xl bg-gray-50 px-4 py-8 text-center">
                                    <p className="text-xs text-gray-400">
                                        Click to expand page {pageNum}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </Document>
        </div>
    );
}

// ─── Individual Overlay Input ─────────────────────────────────────────────

interface OverlayInputProps {
    field: OverlayField;
    value: string;
    onChange: (fieldId: string, value: string) => void;
    compensationModel?: string;
    isOptionB: boolean;
}

function OverlayInput({ field, value, onChange, compensationModel, isOptionB }: OverlayInputProps) {
    // Hide fixed lease fields when Option A is selected
    if (
        (field.id === 'fixed_monthly_sum_words' || field.id === 'fixed_monthly_sum_figures') &&
        !isOptionB
    ) {
        return null;
    }

    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${field.topPct}%`,
        left: `${field.leftPct}%`,
        width: `${field.widthPct}%`,
        pointerEvents: 'auto',
    };

    // Radio group for compensation model
    if (field.type === 'radio') {
        return (
            <div style={baseStyle} className="bg-white/95 rounded-lg border border-amber-200 shadow-sm p-3">
                <p className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    {field.label}
                </p>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="compensation_model"
                            value="option_a"
                            checked={compensationModel === 'option_a'}
                            onChange={() => {
                                onChange('compensation_model', 'option_a');
                                // Clear Option B fields when switching to A
                                onChange('fixed_monthly_sum_words', '');
                                onChange('fixed_monthly_sum_figures', '');
                            }}
                            className="w-4 h-4 text-[#D7A04D] focus:ring-[#D7A04D] cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                            Option A: Revenue Share
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="compensation_model"
                            value="option_b"
                            checked={compensationModel === 'option_b'}
                            onChange={() => onChange('compensation_model', 'option_b')}
                            className="w-4 h-4 text-[#D7A04D] focus:ring-[#D7A04D] cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                            Option B: Fixed Lease
                        </span>
                    </label>
                </div>
            </div>
        );
    }

    // Standard input field
    return (
        <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.label}
            title={field.label}
            style={{
                ...baseStyle,
                fontSize: `${(field.fontSize || 10)}px`,
            }}
            className={`
                bg-blue-50/60 hover:bg-blue-50/90 focus:bg-blue-50
                border-b-2 border-blue-400/60 focus:border-[#D7A04D]
                border-t-0 border-l-0 border-r-0
                outline-none px-1 py-0.5
                text-gray-900 placeholder:text-blue-400/60
                transition-all duration-150
                ${field.required ? 'placeholder:after:content-["*"]' : ''}
            `}
        />
    );
}
