/**
 * Contract Field Map — Defines overlay input positions for the GlideX Host Contract.
 *
 * All coordinates are PERCENTAGES (0-100) relative to the PDF page dimensions.
 * This ensures inputs scale correctly regardless of rendered page size.
 *
 * The PDF is US Letter (612×792 points). Coordinates were mapped from the
 * GlideX_Host Contract_1.pdf blank field positions.
 *
 * To add fields for a new contract, create a new FieldMap array.
 */

export interface OverlayField {
    /** Unique field identifier used as formData key */
    id: string;
    /** Display label / placeholder */
    label: string;
    /** Which page (1-indexed) this field appears on */
    page: number;
    /** Top position as percentage of page height */
    topPct: number;
    /** Left position as percentage of page width */
    leftPct: number;
    /** Width as percentage of page width */
    widthPct: number;
    /** Field type */
    type: 'text' | 'date' | 'number' | 'select' | 'radio';
    /** Whether the field is required */
    required: boolean;
    /** Options for select/radio types */
    options?: string[];
    /** Visual group label (for UI grouping) */
    group?: string;
    /** Font size in rendered pixels (at scale 1.0) */
    fontSize?: number;
}

// ─── GlideX Host Contract Field Map ──────────────────────────────────────────

export const GLIDEX_HOST_CONTRACT_FIELDS: OverlayField[] = [
    // ═══════════════════════════════════════════════════════════
    // PAGE 1 — Agreement date, Host info, Vehicle info, GPS
    // ═══════════════════════════════════════════════════════════

    // Agreement Date fields
    {
        id: 'agreement_day',
        label: 'Day',
        page: 1,
        topPct: 22.5,
        leftPct: 47,
        widthPct: 6,
        type: 'text',
        required: true,
        group: 'Agreement Date',
        fontSize: 10,
    },
    {
        id: 'agreement_month',
        label: 'Month',
        page: 1,
        topPct: 22.5,
        leftPct: 60,
        widthPct: 12,
        type: 'text',
        required: true,
        group: 'Agreement Date',
        fontSize: 10,
    },
    {
        id: 'agreement_year',
        label: 'Year',
        page: 1,
        topPct: 22.5,
        leftPct: 80,
        widthPct: 6,
        type: 'text',
        required: true,
        group: 'Agreement Date',
        fontSize: 10,
    },

    // Host Details
    {
        id: 'host_name',
        label: 'Full Name',
        page: 1,
        topPct: 33,
        leftPct: 12,
        widthPct: 55,
        type: 'text',
        required: true,
        group: 'Host Information',
        fontSize: 10,
    },
    {
        id: 'host_id_number',
        label: 'ID Number',
        page: 1,
        topPct: 35,
        leftPct: 24,
        widthPct: 30,
        type: 'text',
        required: true,
        group: 'Host Information',
        fontSize: 10,
    },
    {
        id: 'host_kra_pin',
        label: 'KRA PIN',
        page: 1,
        topPct: 37,
        leftPct: 42,
        widthPct: 28,
        type: 'text',
        required: true,
        group: 'Host Information',
        fontSize: 10,
    },
    {
        id: 'host_po_box',
        label: 'P.O. Box',
        page: 1,
        topPct: 39,
        leftPct: 24,
        widthPct: 20,
        type: 'text',
        required: true,
        group: 'Host Information',
        fontSize: 10,
    },

    // Vehicle Information
    {
        id: 'vehicle_make_model',
        label: 'Make and Model',
        page: 1,
        topPct: 45,
        leftPct: 28,
        widthPct: 45,
        type: 'text',
        required: true,
        group: 'Vehicle Information',
        fontSize: 10,
    },
    {
        id: 'vehicle_reg_number',
        label: 'Registration No.',
        page: 1,
        topPct: 47,
        leftPct: 32,
        widthPct: 28,
        type: 'text',
        required: true,
        group: 'Vehicle Information',
        fontSize: 10,
    },
    {
        id: 'vehicle_chassis_no',
        label: 'Chassis No.',
        page: 1,
        topPct: 49,
        leftPct: 22,
        widthPct: 35,
        type: 'text',
        required: true,
        group: 'Vehicle Information',
        fontSize: 10,
    },
    {
        id: 'vehicle_engine_no',
        label: 'Engine No.',
        page: 1,
        topPct: 51,
        leftPct: 22,
        widthPct: 35,
        type: 'text',
        required: true,
        group: 'Vehicle Information',
        fontSize: 10,
    },
    {
        id: 'vehicle_year',
        label: 'Year of Manufacture',
        page: 1,
        topPct: 53,
        leftPct: 34,
        widthPct: 12,
        type: 'text',
        required: true,
        group: 'Vehicle Information',
        fontSize: 10,
    },

    // GPS Log-in Details
    {
        id: 'gps_company',
        label: 'GPS Company',
        page: 1,
        topPct: 60,
        leftPct: 22,
        widthPct: 40,
        type: 'text',
        required: true,
        group: 'GPS Details',
        fontSize: 10,
    },
    {
        id: 'gps_app_name',
        label: 'App Name',
        page: 1,
        topPct: 62,
        leftPct: 38,
        widthPct: 30,
        type: 'text',
        required: true,
        group: 'GPS Details',
        fontSize: 10,
    },
    {
        id: 'gps_login',
        label: 'Login',
        page: 1,
        topPct: 64,
        leftPct: 16,
        widthPct: 35,
        type: 'text',
        required: true,
        group: 'GPS Details',
        fontSize: 10,
    },
    {
        id: 'gps_password',
        label: 'Password',
        page: 1,
        topPct: 66,
        leftPct: 20,
        widthPct: 35,
        type: 'text',
        required: true,
        group: 'GPS Details',
        fontSize: 10,
    },

    // ═══════════════════════════════════════════════════════════
    // PAGE 2 — Commencement Date and Period
    // ═══════════════════════════════════════════════════════════
    {
        id: 'commencement_date',
        label: 'Date',
        page: 2,
        topPct: 10,
        leftPct: 62,
        widthPct: 10,
        type: 'text',
        required: true,
        group: 'Agreement Terms',
        fontSize: 10,
    },
    {
        id: 'commencement_year',
        label: 'Year',
        page: 2,
        topPct: 10,
        leftPct: 78,
        widthPct: 6,
        type: 'text',
        required: true,
        group: 'Agreement Terms',
        fontSize: 10,
    },
    {
        id: 'lease_period_months',
        label: 'Months',
        page: 2,
        topPct: 14,
        leftPct: 52,
        widthPct: 8,
        type: 'number',
        required: true,
        group: 'Agreement Terms',
        fontSize: 10,
    },

    // ═══════════════════════════════════════════════════════════
    // PAGE 4 — Compensation Models (mutual exclusion)
    // ═══════════════════════════════════════════════════════════
    {
        id: 'compensation_model',
        label: 'Select Compensation Model',
        page: 4,
        topPct: 12,
        leftPct: 10,
        widthPct: 80,
        type: 'radio',
        required: true,
        options: ['option_a', 'option_b'],
        group: 'Compensation',
        fontSize: 10,
    },
    {
        id: 'fixed_monthly_sum_words',
        label: 'Monthly Sum (Words)',
        page: 4,
        topPct: 72,
        leftPct: 32,
        widthPct: 50,
        type: 'text',
        required: false, // only required when option_b selected
        group: 'Compensation',
        fontSize: 10,
    },
    {
        id: 'fixed_monthly_sum_figures',
        label: 'Kshs.',
        page: 4,
        topPct: 75,
        leftPct: 16,
        widthPct: 25,
        type: 'number',
        required: false, // only required when option_b selected
        group: 'Compensation',
        fontSize: 10,
    },
];

/**
 * Helper: get fields for a specific page
 */
export function getFieldsForPage(
    fields: OverlayField[],
    page: number
): OverlayField[] {
    return fields.filter((f) => f.page === page);
}

/**
 * Helper: get all unique page numbers that have fields
 */
export function getPagesWithFields(fields: OverlayField[]): number[] {
    return [...new Set(fields.map((f) => f.page))].sort((a, b) => a - b);
}
