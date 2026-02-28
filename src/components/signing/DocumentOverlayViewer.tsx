/**
 * DocumentOverlayViewer — Enhanced PDF viewer with overlay inputs.
 *
 * Architecture:
 *   - Uses react-pdf to render each page as a canvas
 *   - Each page gets a per-page overlay div with positioned inputs
 *   - Coordinates are percentage-based (from contractFieldMap)
 *   - Zoom controls (fit/zoom-in/zoom-out)
 *   - Page navigation with mini-map
 *   - Responsive scaling based on viewport
 *   - Error highlighting on unfilled required fields
 *
 * Props:
 *   - pdfUrl: URL of the PDF to render
 *   - fields: OverlayField[] config from contractFieldMap
 *   - formData: current form state
 *   - onFormDataChange: callback to update form state
 *   - showFieldErrors: whether to highlight unfilled required fields
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { type OverlayField, getFieldsForPage } from '@/lib/signing/contractFieldMap';
import {
    FileText,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ZoomIn,
    ZoomOut,
    Maximize,
} from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentOverlayViewerProps {
    pdfUrl: string;
    fields: OverlayField[];
    formData: Record<string, string>;
    onFormDataChange: (fieldId: string, value: string) => void;
    showFieldErrors?: boolean;
}

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5];
const BASE_WIDTH = 700;

export default function DocumentOverlayViewer({
    pdfUrl,
    fields,
    formData,
    onFormDataChange,
    showFieldErrors = false,
}: DocumentOverlayViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [collapsedPages, setCollapsedPages] = useState<Set<number>>(new Set());
    const [zoomIndex, setZoomIndex] = useState<number>(2); // default 1.0x
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(BASE_WIDTH);

    // Measure container width for responsive scaling
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        observer.observe(container);
        setContainerWidth(container.getBoundingClientRect().width);
        return () => observer.disconnect();
    }, []);

    const zoomFactor = ZOOM_LEVELS[zoomIndex];
    const pageWidth = Math.min(containerWidth - 32, BASE_WIDTH) * zoomFactor;

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

    const isOptionB = formData['compensation_model'] === 'option_b';

    const handleZoomIn = () => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1));
    const handleZoomOut = () => setZoomIndex((i) => Math.max(i - 1, 0));
    const handleZoomReset = () => setZoomIndex(2);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        const el = document.getElementById(`pdf-page-${page}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (pdfError) {
        return (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-8 text-center">
                <p className="text-sm text-red-600">{pdfError}</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-3 py-2">
                {/* Page navigation */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => goToPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-medium text-gray-600 tabular-nums min-w-[4.5rem] text-center">
                        Page {currentPage} / {numPages || '—'}
                    </span>
                    <button
                        type="button"
                        onClick={() => goToPage(Math.min(numPages, currentPage + 1))}
                        disabled={currentPage >= numPages}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        disabled={zoomIndex <= 0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleZoomReset}
                        className="px-2 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors tabular-nums"
                    >
                        {Math.round(zoomFactor * 100)}%
                    </button>
                    <button
                        type="button"
                        onClick={handleZoomIn}
                        disabled={zoomIndex >= ZOOM_LEVELS.length - 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button
                        type="button"
                        onClick={handleZoomReset}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Fit to width"
                    >
                        <Maximize className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* PDF Document */}
            <div className="overflow-x-auto">
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

                        // Count unfilled required fields on this page
                        const unfilledCount = showFieldErrors
                            ? pageFields.filter((f) => {
                                if (!f.required) return false;
                                if (f.id === 'fixed_monthly_sum_words' || f.id === 'fixed_monthly_sum_figures') {
                                    return isOptionB && !formData[f.id]?.trim();
                                }
                                return !formData[f.id]?.trim();
                            }).length
                            : 0;

                        return (
                            <div key={pageNum} className="mb-6" id={`pdf-page-${pageNum}`}>
                                {/* Page header */}
                                <div
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-t-2xl border border-b-0 border-gray-200 ${hasFields
                                            ? unfilledCount > 0
                                                ? 'bg-red-50 cursor-pointer hover:bg-red-100/80'
                                                : 'bg-amber-50 cursor-pointer hover:bg-amber-100/80'
                                            : 'bg-gray-50'
                                        } transition-colors`}
                                    onClick={() => {
                                        if (hasFields) togglePage(pageNum);
                                        setCurrentPage(pageNum);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-medium text-gray-600">
                                            Page {pageNum} of {numPages}
                                        </span>
                                        {hasFields && (
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${unfilledCount > 0
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-[#D7A04D]/15 text-[#D7A04D]'
                                                    }`}
                                            >
                                                {unfilledCount > 0
                                                    ? `${unfilledCount} unfilled`
                                                    : `${pageFields.length} field${pageFields.length > 1 ? 's' : ''}`
                                                }
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
                                        <Page
                                            pageNumber={pageNum}
                                            width={pageWidth}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />

                                        {/* Overlay Input Layer */}
                                        {hasFields && (
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{ width: pageWidth }}
                                            >
                                                {pageFields.map((field) => (
                                                    <OverlayInput
                                                        key={field.id}
                                                        field={field}
                                                        value={formData[field.id] || ''}
                                                        onChange={onFormDataChange}
                                                        compensationModel={formData['compensation_model']}
                                                        isOptionB={isOptionB}
                                                        showError={
                                                            showFieldErrors &&
                                                            field.required &&
                                                            !formData[field.id]?.trim()
                                                        }
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
        </div>
    );
}

// ─── Individual Overlay Input ─────────────────────────────────

interface OverlayInputProps {
    field: OverlayField;
    value: string;
    onChange: (fieldId: string, value: string) => void;
    compensationModel?: string;
    isOptionB: boolean;
    showError?: boolean;
}

function OverlayInput({ field, value, onChange, compensationModel, isOptionB, showError }: OverlayInputProps) {
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

    // Standard input field with error state
    return (
        <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.label}
            title={field.label}
            id={`overlay-${field.id}`}
            style={{
                ...baseStyle,
                fontSize: `${field.fontSize || 10}px`,
            }}
            className={`
                ${showError
                    ? 'bg-red-50/80 hover:bg-red-50 border-b-2 border-red-400 focus:border-red-500'
                    : value?.trim()
                        ? 'bg-green-50/60 hover:bg-green-50/90 border-b-2 border-green-400/60 focus:border-green-500'
                        : 'bg-blue-50/60 hover:bg-blue-50/90 border-b-2 border-blue-400/60 focus:border-[#D7A04D]'
                }
                border-t-0 border-l-0 border-r-0
                outline-none px-1 py-0.5
                text-gray-900 placeholder:text-blue-400/60
                transition-all duration-150
            `}
        />
    );
}
