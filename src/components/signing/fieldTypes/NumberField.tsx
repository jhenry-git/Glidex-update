import type { FormField } from '@/lib/signing/signingService';

interface NumberFieldProps {
  field: FormField;
  value: string;
  onChange: (fieldId: string, value: string) => void;
  error?: boolean;
  isOptionB?: boolean;
}

export default function NumberField({
  field,
  value,
  onChange,
  error,
  isOptionB,
}: NumberFieldProps) {
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
    ${showError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#D7A04D]/40'}
    bg-white
  `;

  return (
    <div className="space-y-1">
      <label htmlFor={`field-${field.id}`} className="text-xs font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={`field-${field.id}`}
        type="number"
        value={value}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className={baseClasses}
        autoComplete="off"
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
      />
      {showError && (
        <p className="text-xs text-red-500 mt-1">
          {field.required ? 'This field is required' : 'Invalid number'}
        </p>
      )}
    </div>
  );
}