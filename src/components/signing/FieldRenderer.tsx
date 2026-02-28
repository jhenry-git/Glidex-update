/**
 * FieldRenderer — Dynamic form field renderer for document signing.
 *
 * Renders different input types with validation states:
 *   - Text, Number, Date, Select, Checkbox, Radio
 *   - Initials, Signature (placeholders for specialty fields)
 *
 * Supports:
 *   - Error/success/required visual states
 *   - Mobile-optimized inputs
 *   - Group-based layout
 */

import type { FormField } from '@/lib/signing/signingService';
import { AlertCircle, Check } from 'lucide-react';

interface FieldRendererProps {
    field: FormField;
    value: string;
    onChange: (fieldId: string, value: string) => void;
    error?: boolean;
    compensationModel?: string;
    isOptionB?: boolean;
}

export default function FieldRenderer({
    field,
    value,
    onChange,
    error,
    compensationModel,
    isOptionB,
}: FieldRendererProps) {
    // Hide fixed lease fields when Option A is selected
    if (
        (field.id === 'fixed_monthly_sum_words' || field.id === 'fixed_monthly_sum_figures') &&
        !isOptionB
    ) {
        return null;
    }

    const isFilled = value?.trim().length > 0;
    const showError = error && field.required && !isFilled;

    const baseClasses = `
        w-full px-3 py-2.5 rounded-xl text-sm text-gray-900
        placeholder:text-gray-400
        transition-all duration-200
        focus:outline-none focus:ring-2
        ${showError
            ? 'border-red-300 bg-red-50/50 focus:ring-red-200 focus:border-red-400'
            : isFilled
                ? 'border-green-300 bg-green-50/30 focus:ring-green-200 focus:border-green-400'
                : 'border-gray-300 bg-white focus:ring-[#D7A04D]/30 focus:border-[#D7A04D]'
        }
        border
    `;

    // Radio group (compensation model)
    if (field.type === 'select' && field.options && field.id === 'compensation_model') {
        return (
            <FieldWrapper field={field} showError={showError}>
                <div className="flex flex-col sm:flex-row gap-2">
                    {(field.options || []).map((option) => {
                        const optionValue = option.toLowerCase().replace(/\s+/g, '_');
                        const isSelected = compensationModel === optionValue || value === option;

                        return (
                            <label
                                key={option}
                                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 flex-1 ${isSelected
                                        ? 'border-[#D7A04D] bg-[#D7A04D]/5'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={optionValue}
                                    checked={isSelected}
                                    onChange={() => {
                                        onChange(field.id, optionValue);
                                        if (optionValue !== 'option_b') {
                                            onChange('fixed_monthly_sum_words', '');
                                            onChange('fixed_monthly_sum_figures', '');
                                        }
                                    }}
                                    className="w-4 h-4 text-[#D7A04D] focus:ring-[#D7A04D] cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {option}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-[#D7A04D] ml-auto" />}
                            </label>
                        );
                    })}
                </div>
            </FieldWrapper>
        );
    }

    // Select dropdown
    if (field.type === 'select' && field.options) {
        return (
            <FieldWrapper field={field} showError={showError}>
                <select
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    className={baseClasses}
                >
                    <option value="">Select {field.label}…</option>
                    {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </FieldWrapper>
        );
    }

    // Checkbox
    if (field.type === 'checkbox') {
        return (
            <FieldWrapper field={field} showError={showError}>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={value === 'true'}
                        onChange={(e) => onChange(field.id, e.target.checked ? 'true' : '')}
                        className="w-5 h-5 rounded border-gray-300 text-[#D7A04D] focus:ring-[#D7A04D] cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        {field.label}
                    </span>
                </label>
            </FieldWrapper>
        );
    }

    // Date input
    if (field.type === 'date') {
        return (
            <FieldWrapper field={field} showError={showError}>
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    className={baseClasses}
                />
            </FieldWrapper>
        );
    }

    // Number input
    if (field.type === 'number') {
        return (
            <FieldWrapper field={field} showError={showError}>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    placeholder={field.placeholder || field.label}
                    className={baseClasses}
                    inputMode="numeric"
                />
            </FieldWrapper>
        );
    }

    // Default: text input
    return (
        <FieldWrapper field={field} showError={showError}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder || field.label}
                className={baseClasses}
                autoComplete="off"
            />
        </FieldWrapper>
    );
}

// ─── Field Wrapper ────────────────────────────────────────────

function FieldWrapper({
    field,
    showError,
    children,
}: {
    field: FormField;
    showError?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label
                    htmlFor={field.id}
                    className="text-xs font-medium text-gray-600 flex items-center gap-1"
                >
                    {field.label}
                    {field.required && (
                        <span className="text-red-400 text-xs">*</span>
                    )}
                </label>
                {showError && (
                    <span className="flex items-center gap-1 text-[10px] text-red-500 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Required
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

// ─── Field Group Renderer ─────────────────────────────────────

interface FieldGroupRendererProps {
    fields: FormField[];
    formData: Record<string, string>;
    onFormDataChange: (fieldId: string, value: string) => void;
    showErrors?: boolean;
    compensationModel?: string;
}

export function FieldGroupRenderer({
    fields,
    formData,
    onFormDataChange,
    showErrors,
    compensationModel,
}: FieldGroupRendererProps) {
    // Group fields by group name
    const groups: Record<string, FormField[]> = {};
    const ungrouped: FormField[] = [];

    for (const field of fields) {
        if (field.group) {
            if (!groups[field.group]) groups[field.group] = [];
            groups[field.group].push(field);
        } else {
            ungrouped.push(field);
        }
    }

    const isOptionB = compensationModel === 'option_b';

    return (
        <div className="space-y-6">
            {/* Grouped fields */}
            {Object.entries(groups).map(([groupName, groupFields]) => (
                <div key={groupName} className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {groupName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {groupFields.map((field) => (
                            <div
                                key={field.id}
                                className={
                                    field.type === 'select' || field.id === 'compensation_model'
                                        ? 'sm:col-span-2'
                                        : ''
                                }
                                id={`field-${field.id}`}
                            >
                                <FieldRenderer
                                    field={field}
                                    value={formData[field.id] || ''}
                                    onChange={onFormDataChange}
                                    error={showErrors}
                                    compensationModel={compensationModel}
                                    isOptionB={isOptionB}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Ungrouped fields */}
            {ungrouped.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ungrouped.map((field) => (
                        <div key={field.id} id={`field-${field.id}`}>
                            <FieldRenderer
                                field={field}
                                value={formData[field.id] || ''}
                                onChange={onFormDataChange}
                                error={showErrors}
                                compensationModel={compensationModel}
                                isOptionB={isOptionB}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
