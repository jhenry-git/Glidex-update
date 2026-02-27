-- =============================================================
-- Document Signing Tables
-- Run against the SIGNING Supabase project (pvwqazfxacimavdoceli)
-- =============================================================

-- 1. document_requests
-- Stores signing requests created by admins
CREATE TABLE IF NOT EXISTS document_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email   TEXT NOT NULL DEFAULT 'support@glidexp.com',
  client_email  TEXT,
  document_url  TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'signed', 'expired', 'cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  signed_at     TIMESTAMPTZ
);

-- 2. signed_documents
-- Stores metadata about completed signatures
CREATE TABLE IF NOT EXISTS signed_documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID NOT NULL REFERENCES document_requests(id) ON DELETE CASCADE,
  signed_file_url TEXT NOT NULL,
  signer_name     TEXT NOT NULL,
  signed_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status);
CREATE INDEX IF NOT EXISTS idx_signed_documents_request_id ON signed_documents(request_id);

-- =============================================================
-- Row Level Security
-- =============================================================

ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE signed_documents  ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads on document_requests (needed by the client page)
CREATE POLICY "Allow anonymous read on document_requests"
  ON document_requests
  FOR SELECT
  TO anon
  USING (true);

-- Service role has full access (used by Edge Function)
CREATE POLICY "Service role full access on document_requests"
  ON document_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on signed_documents"
  ON signed_documents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================
-- Storage bucket (run manually if not auto-created)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('agreements', 'agreements', true)
-- ON CONFLICT (id) DO NOTHING;
-- =============================================================
