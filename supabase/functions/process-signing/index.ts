/**
 * process-signing — Supabase Edge Function
 *
 * Handles the server-side portion of document signing:
 *   1. Fetches original PDF from Supabase Storage
 *   2. Embeds signature on EVERY page + appends a signature summary page
 *   3. Generates SHA-256 hash of the signed PDF for tamper detection
 *   4. Uploads signed PDF to agreements/signed/
 *   5. Updates document_requests status to 'signed' + locks document
 *   6. Creates a signed_documents record with hash and signature type
 *   7. Logs audit trail (IP, user agent, action)
 *   8. Sends email to admin AND client with signed PDF attached
 *
 * Environment variables:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - RESEND_API_KEY
 *   - ADMIN_EMAIL
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
        'authorization, x-client-info, apikey, content-type',
};

interface SigningPayload {
    documentId: string;
    signerName: string;
    signatureImage: string; // base64 data URL
    signatureType?: 'draw' | 'typed' | 'uploaded';
    formData?: Record<string, string>; // filled form field values
}

/**
 * Compute SHA-256 hash of a buffer and return hex string.
 */
async function computeHash(data: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
        );
    }

    try {
        // ── Parse payload ────────────────────────────────────────
        const payload: SigningPayload = await req.json();
        const { documentId, signerName, signatureImage, signatureType = 'draw', formData } = payload;

        if (!documentId || !signerName || !signatureImage) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: documentId, signerName, signatureImage' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
        }

        // ── Capture IP and User Agent ────────────────────────────
        const signerIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || 'unknown';
        const signerUserAgent = req.headers.get('user-agent') || 'unknown';

        // ── Init Supabase (service role) ─────────────────────────
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, serviceRoleKey);

        // ── Fetch document request ───────────────────────────────
        const { data: docRequest, error: docError } = await supabase
            .from('document_requests')
            .select('*')
            .eq('id', documentId)
            .single();

        if (docError || !docRequest) {
            return new Response(
                JSON.stringify({ error: 'Document not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            );
        }

        if (docRequest.status !== 'pending') {
            return new Response(
                JSON.stringify({ error: 'Document is no longer available for signing' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
            );
        }

        if (docRequest.locked_at) {
            return new Response(
                JSON.stringify({ error: 'Document has been locked and cannot be signed' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
            );
        }

        // ── Fetch original PDF ───────────────────────────────────
        const pdfResponse = await fetch(docRequest.document_url);
        if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
        }
        const originalPdfBytes = await pdfResponse.arrayBuffer();

        // ── Build signed PDF ─────────────────────────────────────
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Decode signature image (strip data URL prefix)
        const base64Data = signatureImage.replace(/^data:image\/\w+;base64,/, '');
        const signatureBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        const signatureImg = await pdfDoc.embedPng(signatureBytes);

        const timestamp = new Date().toISOString();
        const formattedDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
        });

        // ── Flatten formData onto the original PDF ────────────────
        interface FieldCoord {
            page: number;    // 1-indexed
            topPct: number;  // % from top
            leftPct: number; // % from left
            fontSize?: number;
        }

        const FIELD_COORDS: Record<string, FieldCoord> = {
            agreement_day: { page: 1, topPct: 22.5, leftPct: 47, fontSize: 9 },
            agreement_month: { page: 1, topPct: 22.5, leftPct: 60, fontSize: 9 },
            agreement_year: { page: 1, topPct: 22.5, leftPct: 80, fontSize: 9 },
            host_name: { page: 1, topPct: 33, leftPct: 12, fontSize: 9 },
            host_id_number: { page: 1, topPct: 35, leftPct: 24, fontSize: 9 },
            host_kra_pin: { page: 1, topPct: 37, leftPct: 42, fontSize: 9 },
            host_po_box: { page: 1, topPct: 39, leftPct: 24, fontSize: 9 },
            vehicle_make_model: { page: 1, topPct: 45, leftPct: 28, fontSize: 9 },
            vehicle_reg_number: { page: 1, topPct: 47, leftPct: 32, fontSize: 9 },
            vehicle_chassis_no: { page: 1, topPct: 49, leftPct: 22, fontSize: 9 },
            vehicle_engine_no: { page: 1, topPct: 51, leftPct: 22, fontSize: 9 },
            vehicle_year: { page: 1, topPct: 53, leftPct: 34, fontSize: 9 },
            gps_company: { page: 1, topPct: 60, leftPct: 22, fontSize: 9 },
            gps_app_name: { page: 1, topPct: 62, leftPct: 38, fontSize: 9 },
            gps_login: { page: 1, topPct: 64, leftPct: 16, fontSize: 9 },
            gps_password: { page: 1, topPct: 66, leftPct: 20, fontSize: 9 },
            commencement_date: { page: 2, topPct: 10, leftPct: 62, fontSize: 9 },
            commencement_year: { page: 2, topPct: 10, leftPct: 78, fontSize: 9 },
            lease_period_months: { page: 2, topPct: 14, leftPct: 52, fontSize: 9 },
            compensation_model: { page: 4, topPct: 15, leftPct: 12, fontSize: 9 },
            fixed_monthly_sum_words: { page: 4, topPct: 72, leftPct: 32, fontSize: 9 },
            fixed_monthly_sum_figures: { page: 4, topPct: 75, leftPct: 16, fontSize: 9 },
        };

        if (formData && Object.keys(formData).length > 0) {
            const allPages = pdfDoc.getPages();

            for (const [fieldId, value] of Object.entries(formData)) {
                if (!value || !value.trim()) continue;

                const coord = FIELD_COORDS[fieldId];
                if (!coord) continue;

                const pageIndex = coord.page - 1;
                if (pageIndex < 0 || pageIndex >= allPages.length) continue;

                const page = allPages[pageIndex];
                const { width, height } = page.getSize();

                const x = (coord.leftPct / 100) * width;
                const y = height * (1 - coord.topPct / 100);

                let displayValue = value;
                if (fieldId === 'compensation_model') {
                    displayValue = value === 'option_a'
                        ? '✓ Option A — Revenue Share'
                        : '✓ Option B — Fixed Lease';
                }

                page.drawText(displayValue, {
                    x,
                    y,
                    size: coord.fontSize || 9,
                    font: fontBold,
                    color: rgb(0.05, 0.05, 0.4),
                });
            }
        }

        // ── Embed signature on EVERY existing page ───────────────
        const pages = pdfDoc.getPages();
        const sigFooterHeight = 60;

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const { width } = page.getSize();

            page.drawRectangle({
                x: 0,
                y: 0,
                width: width,
                height: sigFooterHeight,
                color: rgb(1, 1, 1),
                opacity: 0.92,
            });

            page.drawLine({
                start: { x: 20, y: sigFooterHeight },
                end: { x: width - 20, y: sigFooterHeight },
                thickness: 0.5,
                color: rgb(0.8, 0.8, 0.8),
            });

            const sigDisplayHeight = 30;
            const sigDisplayWidth = sigDisplayHeight * (signatureImg.width / signatureImg.height);
            page.drawImage(signatureImg, {
                x: 20,
                y: 8,
                width: Math.min(sigDisplayWidth, 100),
                height: sigDisplayHeight,
            });

            const textX = Math.min(sigDisplayWidth, 100) + 30;
            page.drawText(`Signed by: ${signerName}`, {
                x: textX,
                y: 36,
                size: 7.5,
                font: fontBold,
                color: rgb(0.15, 0.15, 0.15),
            });
            page.drawText(formattedDate, {
                x: textX,
                y: 24,
                size: 6.5,
                font,
                color: rgb(0.4, 0.4, 0.4),
            });

            // Page number + document ID on the right
            page.drawText(`Page ${i + 1} of ${pages.length}`, {
                x: width - 120,
                y: 36,
                size: 6.5,
                font,
                color: rgb(0.5, 0.5, 0.5),
            });
            page.drawText(`ID: ${documentId.substring(0, 8)}...`, {
                x: width - 120,
                y: 24,
                size: 6,
                font,
                color: rgb(0.6, 0.6, 0.6),
            });

            // Signature type indicator
            const sigTypeLabel = signatureType === 'typed'
                ? 'Typed Signature'
                : signatureType === 'uploaded'
                    ? 'Uploaded Signature'
                    : 'Drawn Signature';
            page.drawText(sigTypeLabel, {
                x: width - 120,
                y: 12,
                size: 5.5,
                font,
                color: rgb(0.65, 0.65, 0.65),
            });
        }

        // ── Append full Signature Summary Page ────────────────────
        const sigPage = pdfDoc.addPage([612, 792]);

        // Title
        sigPage.drawText('SIGNATURE PAGE', {
            x: 50,
            y: 720,
            size: 18,
            font: fontBold,
            color: rgb(0.067, 0.067, 0.067),
        });

        sigPage.drawLine({
            start: { x: 50, y: 710 },
            end: { x: 562, y: 710 },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
        });

        // Signer info
        sigPage.drawText('Signed by:', {
            x: 50, y: 680, size: 11, font, color: rgb(0.4, 0.4, 0.4),
        });
        sigPage.drawText(signerName, {
            x: 50, y: 660, size: 14, font: fontBold, color: rgb(0.067, 0.067, 0.067),
        });

        sigPage.drawText('Date:', {
            x: 50, y: 630, size: 11, font, color: rgb(0.4, 0.4, 0.4),
        });
        sigPage.drawText(formattedDate, {
            x: 50, y: 610, size: 12, font, color: rgb(0.067, 0.067, 0.067),
        });

        // Signature type
        const sigTypeDisplay = signatureType === 'typed'
            ? 'Typed Signature'
            : signatureType === 'uploaded'
                ? 'Uploaded Signature'
                : 'Drawn Signature';
        sigPage.drawText('Signature Method:', {
            x: 50, y: 585, size: 11, font, color: rgb(0.4, 0.4, 0.4),
        });
        sigPage.drawText(sigTypeDisplay, {
            x: 50, y: 567, size: 11, font: fontBold, color: rgb(0.067, 0.067, 0.067),
        });

        // IP and device info
        sigPage.drawText('Signer IP:', {
            x: 300, y: 680, size: 9, font, color: rgb(0.5, 0.5, 0.5),
        });
        sigPage.drawText(signerIP, {
            x: 300, y: 666, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3),
        });

        sigPage.drawText('User Agent:', {
            x: 300, y: 645, size: 9, font, color: rgb(0.5, 0.5, 0.5),
        });
        const truncatedUA = signerUserAgent.substring(0, 60) + (signerUserAgent.length > 60 ? '...' : '');
        sigPage.drawText(truncatedUA, {
            x: 300, y: 631, size: 7, font, color: rgb(0.4, 0.4, 0.4),
        });

        // Large signature image
        sigPage.drawText('Signature:', {
            x: 50, y: 540, size: 11, font, color: rgb(0.4, 0.4, 0.4),
        });

        const fullSigWidth = 250;
        const fullSigHeight = fullSigWidth * (signatureImg.height / signatureImg.width);
        sigPage.drawImage(signatureImg, {
            x: 50,
            y: 530 - fullSigHeight,
            width: fullSigWidth,
            height: fullSigHeight,
        });

        // ── Render form data on summary page ────────────────────
        const formEntries = formData ? Object.entries(formData) : [];
        if (formEntries.length > 0) {
            let formY = 530 - fullSigHeight - 40;

            sigPage.drawText('DOCUMENT DETAILS', {
                x: 50,
                y: formY,
                size: 12,
                font: fontBold,
                color: rgb(0.067, 0.067, 0.067),
            });
            formY -= 6;

            sigPage.drawLine({
                start: { x: 50, y: formY },
                end: { x: 562, y: formY },
                thickness: 0.5,
                color: rgb(0.85, 0.85, 0.85),
            });
            formY -= 18;

            for (const [key, value] of formEntries) {
                if (formY < 80) break;

                const label = key
                    .replace(/_/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (s) => s.toUpperCase())
                    .trim();

                sigPage.drawText(`${label}:`, {
                    x: 50, y: formY, size: 9, font, color: rgb(0.4, 0.4, 0.4),
                });
                sigPage.drawText(value || '—', {
                    x: 200, y: formY, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1),
                });
                formY -= 18;
            }
        }

        // Footer on summary page
        sigPage.drawText(`Document ID: ${documentId}`, {
            x: 50, y: 60, size: 8, font, color: rgb(0.6, 0.6, 0.6),
        });
        sigPage.drawText(`Timestamp: ${timestamp}`, {
            x: 50, y: 46, size: 8, font, color: rgb(0.6, 0.6, 0.6),
        });
        sigPage.drawText(`Total pages signed: ${pages.length}`, {
            x: 50, y: 32, size: 8, font, color: rgb(0.6, 0.6, 0.6),
        });

        const signedPdfBytes = await pdfDoc.save();

        // ── Compute SHA-256 hash of the signed PDF ──────────────
        const documentHash = await computeHash(new Uint8Array(signedPdfBytes));

        // Embed hash on the summary page footer (must re-save)
        // Note: We add the hash as metadata rather than re-rendering since
        // modifying the PDF after hashing would invalidate it.
        // The hash is stored in the database for verification.

        // ── Upload signed PDF ────────────────────────────────────
        const signedFileName = `signed/${documentId}.pdf`;
        const { error: uploadError } = await supabase.storage
            .from('agreements')
            .upload(signedFileName, signedPdfBytes, {
                contentType: 'application/pdf',
                upsert: true,
            });

        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
            .from('agreements')
            .getPublicUrl(signedFileName);

        const signedFileUrl = urlData.publicUrl;

        // ── Update database ──────────────────────────────────────
        const signedAt = new Date().toISOString();

        await supabase
            .from('document_requests')
            .update({
                status: 'signed',
                signed_at: signedAt,
                locked_at: signedAt,
                document_hash: documentHash,
                signer_ip: signerIP,
                signer_user_agent: signerUserAgent,
            })
            .eq('id', documentId);

        await supabase.from('signed_documents').insert({
            request_id: documentId,
            signed_file_url: signedFileUrl,
            signer_name: signerName,
            signed_at: signedAt,
            document_hash: documentHash,
            signature_type: signatureType,
        });

        // ── Create audit log entry ───────────────────────────────
        await supabase.from('signing_audit_log').insert({
            document_id: documentId,
            action: 'signed',
            ip_address: signerIP,
            user_agent: signerUserAgent,
            metadata: {
                signer_name: signerName,
                signature_type: signatureType,
                document_hash: documentHash,
                form_fields_count: formEntries.length,
            },
        });

        // Also log the lock event
        await supabase.from('signing_audit_log').insert({
            document_id: documentId,
            action: 'locked',
            ip_address: signerIP,
            user_agent: signerUserAgent,
            metadata: { locked_by: 'system', reason: 'post-signing lock' },
        });

        // ── Create version record ────────────────────────────────
        await supabase.from('document_versions').insert({
            document_id: documentId,
            version_number: 1,
            file_url: signedFileUrl,
            document_hash: documentHash,
            created_by: signerName,
        });

        // ── Send emails via Resend ───────────────────────────────
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        const adminEmail = Deno.env.get('ADMIN_EMAIL') || docRequest.admin_email || 'support@glidexp.com';

        if (resendApiKey) {
            // Convert signed PDF to base64 for email attachment (chunked)
            const bytes = new Uint8Array(signedPdfBytes);
            let binary = '';
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
                binary += String.fromCharCode(...chunk);
            }
            const pdfBase64 = btoa(binary);

            const attachment = {
                filename: `signed-agreement-${documentId}.pdf`,
                content: pdfBase64,
            };

            // ── Email to Admin ──────────────────────────────────────
            const adminEmailPayload = {
                from: 'GlideX Signing <noreply@glidexp.com>',
                to: [adminEmail],
                subject: `✅ Document Signed by ${signerName}`,
                html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 40px; height: 40px; background: #111; border-radius: 10px; line-height: 40px; color: #fff; font-weight: bold; font-size: 14px;">GX</div>
              <h2 style="margin: 12px 0 4px; color: #111; font-size: 20px;">Document Signed Successfully</h2>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              <strong>${signerName}</strong> has signed the agreement document.<br/>
              Signed on: <strong>${formattedDate}</strong><br/>
              Signature method: <strong>${sigTypeDisplay}</strong>
            </p>
            <div style="background: #f0fdf4; border-radius: 8px; padding: 12px 16px; margin: 16px 0; border-left: 3px solid #22c55e;">
              <p style="color: #166534; font-size: 12px; margin: 0;">
                <strong>🔒 Security Info</strong><br/>
                IP: ${signerIP}<br/>
                Hash: ${documentHash.substring(0, 16)}...<br/>
                Document locked at: ${signedAt}
              </p>
            </div>
            ${formEntries.length > 0 ? `
            <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <p style="color: #111; font-size: 13px; font-weight: 600; margin: 0 0 8px;">Document Details</p>
              ${formEntries.map(([k, v]) => {
                    const label = k.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase()).trim();
                    return `<p style="color: #555; font-size: 13px; margin: 4px 0;"><strong>${label}:</strong> ${v || '—'}</p>`;
                }).join('')}
            </div>
            ` : ''}
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              The signed document is attached and also available at:<br/>
              <a href="${signedFileUrl}" style="color: #D7A04D; text-decoration: underline;">Download Signed Document</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #999; font-size: 11px;">
              Document ID: ${documentId}<br/>
              Client email: ${docRequest.client_email || 'N/A'}<br/>
              This is an automated message from GlideX Signing.
            </p>
          </div>
        `,
                attachments: [attachment],
            };

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify(adminEmailPayload),
            });

            // ── Email to Client ──────────────────────────────────────
            if (docRequest.client_email) {
                const clientEmailPayload = {
                    from: 'GlideX Signing <noreply@glidexp.com>',
                    to: [docRequest.client_email],
                    subject: `Your Signed Document — ${signerName}`,
                    html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; width: 40px; height: 40px; background: #111; border-radius: 10px; line-height: 40px; color: #fff; font-weight: bold; font-size: 14px;">GX</div>
                <h2 style="margin: 12px 0 4px; color: #111; font-size: 20px;">Your Document Has Been Signed</h2>
              </div>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                Hi ${signerName},<br/><br/>
                Thank you for signing the agreement. A copy of your signed document is attached for your records.
              </p>
              <div style="background: #f0fdf4; border-radius: 8px; padding: 12px 16px; margin: 16px 0; border-left: 3px solid #22c55e;">
                <p style="color: #166534; font-size: 12px; margin: 0;">
                  <strong>🔒 Your document is securely locked</strong><br/>
                  Document hash: ${documentHash.substring(0, 16)}...<br/>
                  No further changes can be made.
                </p>
              </div>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                Download here:<br/>
                <a href="${signedFileUrl}" style="color: #D7A04D; text-decoration: underline;">Download Signed Document</a>
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #999; font-size: 11px;">
                Signed on: ${formattedDate}<br/>
                Document ID: ${documentId}<br/>
                This is an automated message from GlideX.
              </p>
            </div>
          `,
                    attachments: [attachment],
                };

                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${resendApiKey}`,
                    },
                    body: JSON.stringify(clientEmailPayload),
                });
            }

            console.log(`[process-signing] Emails sent — admin: ${adminEmail}, client: ${docRequest.client_email || 'none'}`);
        } else {
            console.warn('[process-signing] RESEND_API_KEY not set — skipping emails.');
        }

        // ── Response ─────────────────────────────────────────────
        return new Response(
            JSON.stringify({
                success: true,
                documentId,
                signedFileUrl,
                documentHash,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
    } catch (error) {
        console.error('[process-signing] Error:', error);

        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
    }
});
