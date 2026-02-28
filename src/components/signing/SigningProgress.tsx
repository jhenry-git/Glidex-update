/**
 * SigningProgress — Step-based progress indicator for the signing workflow.
 *
 * Shows:
 *   - Stepper (Review → Fill → Sign → Done)
 *   - Field completion progress bar
 *   - Auto-save status indicator
 *   - Missing-field summary
 */

import { CheckCircle2, FileText, PenTool, Send, AlertCircle, Loader2, Cloud, CloudOff } from 'lucide-react';
import type { FormField } from '@/lib/signing/signingService';

export type SigningStep = 'review' | 'fill' | 'sign' | 'done';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SigningProgressProps {
    currentStep: SigningStep;
    completionPercentage: number;
    filledCount: number;
    totalCount: number;
    saveStatus: SaveStatus;
    unfilledFields: FormField[];
    onScrollToField?: (fieldId: string) => void;
}

const STEPS: { key: SigningStep; label: string; icon: typeof FileText }[] = [
    { key: 'review', label: 'Review', icon: FileText },
    { key: 'fill', label: 'Fill Fields', icon: PenTool },
    { key: 'sign', label: 'Sign', icon: Send },
    { key: 'done', label: 'Done', icon: CheckCircle2 },
];

function getStepIndex(step: SigningStep): number {
    return STEPS.findIndex((s) => s.key === step);
}

export default function SigningProgress({
    currentStep,
    completionPercentage,
    filledCount,
    totalCount,
    saveStatus,
    unfilledFields,
    onScrollToField,
}: SigningProgressProps) {
    const currentIndex = getStepIndex(currentStep);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Stepper */}
            <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        const isCompleted = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        const isFuture = i > currentIndex;

                        return (
                            <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                {/* Step dot + label */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                ? 'bg-green-500 text-white'
                                                : isCurrent
                                                    ? 'bg-[#D7A04D] text-white shadow-lg shadow-[#D7A04D]/25 scale-110'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-4.5 h-4.5" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] mt-1.5 font-medium transition-colors ${isCurrent
                                                ? 'text-[#D7A04D]'
                                                : isCompleted
                                                    ? 'text-green-600'
                                                    : 'text-gray-400'
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>

                                {/* Connector line (not after last step) */}
                                {i < STEPS.length - 1 && (
                                    <div className="flex-1 mx-2 mb-4">
                                        <div className="h-0.5 rounded-full relative overflow-hidden bg-gray-200">
                                            <div
                                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${isCompleted
                                                        ? 'bg-green-500 w-full'
                                                        : isCurrent && !isFuture
                                                            ? 'bg-[#D7A04D] w-1/2'
                                                            : 'w-0'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress bar + save status */}
            {currentStep === 'fill' && (
                <div className="border-t border-gray-100 px-4 sm:px-6 py-3 space-y-2">
                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${completionPercentage === 100
                                        ? 'bg-green-500'
                                        : completionPercentage >= 50
                                            ? 'bg-[#D7A04D]'
                                            : 'bg-amber-400'
                                    }`}
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 tabular-nums min-w-[4rem] text-right">
                            {filledCount}/{totalCount} fields
                        </span>
                    </div>

                    {/* Save status + unfilled fields */}
                    <div className="flex items-center justify-between">
                        <SaveStatusIndicator status={saveStatus} />

                        {unfilledFields.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onScrollToField?.(unfilledFields[0].id)}
                                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                            >
                                <AlertCircle className="w-3 h-3" />
                                {unfilledFields.length} field{unfilledFields.length > 1 ? 's' : ''} remaining
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Save Status Indicator ────────────────────────────────────

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
    if (status === 'idle') return null;

    const config = {
        saving: {
            icon: Loader2,
            text: 'Saving…',
            className: 'text-gray-400',
            animate: true,
        },
        saved: {
            icon: Cloud,
            text: 'All changes saved',
            className: 'text-green-500',
            animate: false,
        },
        error: {
            icon: CloudOff,
            text: 'Save failed',
            className: 'text-red-500',
            animate: false,
        },
    }[status];

    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-1 text-xs font-medium ${config.className}`}>
            <Icon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
            {config.text}
        </div>
    );
}
