/**
 * process-signing — Supabase Edge Function
 *
 * Handles the server-side portion of document signing:
 *   1. Fetches original PDF from Supabase Storage
 *   2. Embeds signature image, signer name, and timestamp using pdf-lib
 *   3. Uploads signed PDF to agreements/signed/
 *   4. Updates document_requests status to 'signed'
 *   5. Creates a signed_documents record
 *   6. Sends email via Resend with the signed PDF attached
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
        const { documentId, signerName, signatureImage } = payload;

        if (!documentId || !signerName || !signatureImage) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: documentId, signerName, signatureImage' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
        }

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

        // Add a new signature page at the end
        const page = pdfDoc.addPage([612, 792]); // US Letter
        const timestamp = new Date().toISOString();
        const formattedDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
        });

        // Title
        page.drawText('SIGNATURE PAGE', {
            x: 50,
            y: 720,
            size: 18,
            font: fontBold,
            color: rgb(0.067, 0.067, 0.067),
        });

        // Divider
        page.drawLine({
            start: { x: 50, y: 710 },
            end: { x: 562, y: 710 },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
        });

        // Signer info
        page.drawText('Signed by:', {
            x: 50,
            y: 680,
            size: 11,
            font,
            color: rgb(0.4, 0.4, 0.4),
        });
        page.drawText(signerName, {
            x: 50,
            y: 660,
            size: 14,
            font: fontBold,
            color: rgb(0.067, 0.067, 0.067),
        });

        page.drawText('Date:', {
            x: 50,
            y: 630,
            size: 11,
            font,
            color: rgb(0.4, 0.4, 0.4),
        });
        page.drawText(formattedDate, {
            x: 50,
            y: 610,
            size: 12,
            font,
            color: rgb(0.067, 0.067, 0.067),
        });

        // Signature image
        page.drawText('Signature:', {
            x: 50,
            y: 570,
            size: 11,
            font,
            color: rgb(0.4, 0.4, 0.4),
        });

        const sigWidth = 250;
        const sigHeight = sigWidth * (signatureImg.height / signatureImg.width);
        page.drawImage(signatureImg, {
            x: 50,
            y: 560 - sigHeight,
            width: sigWidth,
            height: sigHeight,
        });

        // Footer
        page.drawText(`Document ID: ${documentId}`, {
            x: 50,
            y: 60,
            size: 8,
            font,
            color: rgb(0.6, 0.6, 0.6),
        });
        page.drawText(`Timestamp: ${timestamp}`, {
            x: 50,
            y: 46,
            size: 8,
            font,
            color: rgb(0.6, 0.6, 0.6),
        });

        const signedPdfBytes = await pdfDoc.save();

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
            })
            .eq('id', documentId);

        await supabase.from('signed_documents').insert({
            request_id: documentId,
            signed_file_url: signedFileUrl,
            signer_name: signerName,
            signed_at: signedAt,
        });

        // ── Send email via Resend ────────────────────────────────
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'support@glidexp.com';

        if (resendApiKey) {
            // Convert signed PDF to base64 for email attachment
            const pdfBase64 = btoa(
                String.fromCharCode(...new Uint8Array(signedPdfBytes))
            );

            const emailRecipients = [adminEmail];
            if (docRequest.client_email) {
                emailRecipients.push(docRequest.client_email);
            }

            const emailPayload = {
                from: 'GlideX Signing <noreply@glidexp.com>',
                to: emailRecipients,
                subject: `Document Signed by ${signerName}`,
                html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; width: 40px; height: 40px; background: #111; border-radius: 10px; line-height: 40px; color: #fff; font-weight: bold; font-size: 14px;">GX</div>
              <h2 style="margin: 12px 0 4px; color: #111; font-size: 20px;">Document Signed</h2>
            </div>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              <strong>${signerName}</strong> has signed the document.<br/>
              Signed on: ${formattedDate}
            </p>
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              The signed document is attached to this email and also available at:<br/>
              <a href="${signedFileUrl}" style="color: #D7A04D;">${signedFileUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #999; font-size: 11px;">
              Document ID: ${documentId}<br/>
              This is an automated message from GlideX Signing.
            </p>
          </div>
        `,
                attachments: [
                    {
                        filename: `signed-agreement-${documentId}.pdf`,
                        content: pdfBase64,
                    },
                ],
            };

            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify(emailPayload),
            });
        } else {
            console.warn('[process-signing] RESEND_API_KEY not set — skipping email.');
        }

        // ── Response ─────────────────────────────────────────────
        return new Response(
            JSON.stringify({
                success: true,
                documentId,
                signedFileUrl,
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
