/**
 * Safari Enquiries API — Lead capture & WhatsApp handover
 * 
 * Captures tour & safari enquiries from Google Ads & landing page visitors,
 * stores them in Supabase, and generates pre-filled WhatsApp handoffs.
 */

import { supabase } from '@/lib/supabase';

export interface SafariEnquiryPayload {
    fullName: string;
    email: string;
    phone: string;
    safariPackage: string;
    travelDate?: string;
    groupSize?: string;
    vehiclePreference?: string;
    notes?: string;
}

export interface UtmParams {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    gclid?: string;
}

const WHATSAPP_PHONE = '254768266255';

/**
 * Extracts UTM parameters and Google Ads Click ID (gclid) from current URL.
 */
export function getTrackingParams(): UtmParams {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_term: params.get('utm_term') || undefined,
        gclid: params.get('gclid') || undefined,
    };
}

/**
 * Creates a pre-formatted WhatsApp enquiry link.
 */
export function buildSafariWhatsAppUrl(payload: Partial<SafariEnquiryPayload>): string {
    const lines = [
        "👋 *Jambo GlideX Safaris Team!*",
        "I'd like to enquire about an African Safari & 4x4 Tour in Kenya.",
        "",
        `📍 *Package / Destination:* ${payload.safariPackage || 'Custom Safari Expedition'}`,
        `🚙 *4x4 Vehicle Preference:* ${payload.vehiclePreference || 'Safari Land Cruiser (Pop-up Roof)'}`,
        `👥 *Group Size:* ${payload.groupSize || 'Not specified yet'}`,
        `📅 *Estimated Date / Month:* ${payload.travelDate || 'Flexible'}`,
        `👤 *Name:* ${payload.fullName || 'Traveler'}`,
    ];

    if (payload.email) {
        lines.push(`✉️ *Email:* ${payload.email}`);
    }

    if (payload.notes) {
        lines.push(`💬 *Special Notes:* ${payload.notes}`);
    }

    lines.push("", "Could you please send me itinerary options, pricing, and availability?");

    const message = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

/**
 * Sends automated staff notification email to support@glidexp.com via Supabase Edge Function
 */
export async function sendStaffLeadNotification(
    data: SafariEnquiryPayload,
    tracking: UtmParams
): Promise<void> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mxzzsqpqblbzudrlhvjz.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    const htmlMessage = `
        <h2 style="color: #0B0F17; margin-bottom: 15px;">🦁 New African Safari & 4x4 Enquiry</h2>
        <p style="color: #555; margin-bottom: 20px;">A new lead has landed on the GlideX Safari & Tours page and submitted a request:</p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 25px;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; width: 180px; color: #444;">Traveler Name:</td>
                <td style="padding: 10px 0; color: #0B0F17;">${data.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #D7A04D; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Phone / WhatsApp:</td>
                <td style="padding: 10px 0;"><a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold;">${data.phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Selected Package:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #0B0F17;">${data.safariPackage}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Vehicle Preference:</td>
                <td style="padding: 10px 0; color: #0B0F17;">${data.vehiclePreference || 'Standard 4x4'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Travel Date / Month:</td>
                <td style="padding: 10px 0; color: #0B0F17;">${data.travelDate || 'Flexible'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Group Size:</td>
                <td style="padding: 10px 0; color: #0B0F17;">${data.groupSize || 'Not specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px 0; font-weight: bold; color: #444;">Special Requests / Notes:</td>
                <td style="padding: 10px 0; color: #555; white-space: pre-wrap;">${data.notes || 'None provided'}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #777;">Ad Campaign (UTM):</td>
                <td style="padding: 10px 0; color: #777; font-size: 12px;">Source: ${tracking.utm_source || 'organic/direct'} | Campaign: ${tracking.utm_campaign || 'N/A'} | GCLID: ${tracking.gclid || 'N/A'}</td>
            </tr>
        </table>
        
        <p style="margin-top: 20px;">
            <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; padding: 12px 24px; background-color: #25D366; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Message Client on WhatsApp
            </a>
            &nbsp;
            <a href="mailto:${data.email}?subject=GlideX%20Safari%20Quote%20-%20${encodeURIComponent(data.safariPackage)}" style="display: inline-block; padding: 12px 24px; background-color: #0B0F17; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reply by Email
            </a>
        </p>
    `;

    try {
        await fetch(`${supabaseUrl}/functions/v1/sendEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(supabaseAnonKey ? { Authorization: `Bearer ${supabaseAnonKey}` } : {}),
            },
            body: JSON.stringify({
                to: 'support@glidexp.com',
                subject: `🦁 New Safari Enquiry: ${data.fullName} – ${data.safariPackage}`,
                message: htmlMessage,
            }),
        });
    } catch (emailErr) {
        console.warn('[GlideX Safaris] Failed to dispatch staff notification email:', emailErr);
    }
}

/**
 * Submits safari enquiry to Supabase, preserving UTM marketing tags,
 * and notifies support@glidexp.com immediately.
 */
export async function submitSafariEnquiry(
    data: SafariEnquiryPayload
): Promise<{ success: boolean; id?: string; error?: string }> {
    const tracking = getTrackingParams();

    // Trigger instant email notification to support@glidexp.com in parallel
    sendStaffLeadNotification(data, tracking);

    try {
        const { data: inserted, error } = await supabase
            .from('safari_enquiries')
            .insert([
                {
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    safari_package: data.safariPackage,
                    travel_date: data.travelDate || null,
                    group_size: data.groupSize || null,
                    vehicle_preference: data.vehiclePreference || null,
                    notes: data.notes || null,
                    utm_source: tracking.utm_source || null,
                    utm_medium: tracking.utm_medium || null,
                    utm_campaign: tracking.utm_campaign || null,
                    utm_term: tracking.utm_term || null,
                    gclid: tracking.gclid || null,
                },
            ])
            .select('id')
            .single();

        if (error) {
            console.warn('[GlideX Safaris] Supabase insert warning, falling back to local lead storage:', error.message);
            saveLocalLeadBackup(data, tracking);
            return { success: true, id: 'local-' + Date.now() };
        }

        return { success: true, id: inserted?.id };
    } catch (err: unknown) {
        console.error('[GlideX Safaris] Error submitting enquiry:', err);
        saveLocalLeadBackup(data, tracking);
        return { success: true, id: 'fallback-' + Date.now() };
    }
}

function saveLocalLeadBackup(data: SafariEnquiryPayload, tracking: UtmParams) {
    try {
        const existing = JSON.parse(localStorage.getItem('glidex_safari_enquiries') || '[]');
        existing.push({ ...data, ...tracking, submittedAt: new Date().toISOString() });
        localStorage.setItem('glidex_safari_enquiries', JSON.stringify(existing));
    } catch {
        // ignore local storage errors
    }
}
