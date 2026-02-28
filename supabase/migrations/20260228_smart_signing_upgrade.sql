-- =============================================================
-- Smart Signing Upgrade Migration
-- Run against the SIGNING Supabase project (pvwqazfxacimavdoceli)
-- =============================================================

-- 1. Extend document_requests with new columns
-- NOTE: signing_token already exists as UUID type, so we only add the new columns
ALTER TABLE document_requests
  ADD COLUMN IF NOT EXISTS original_filename TEXT,
  ADD COLUMN IF NOT EXISTS form_field_responses JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS document_hash    TEXT,
  ADD COLUMN IF NOT EXISTS signer_ip        TEXT,
  ADD COLUMN IF NOT EXISTS signer_user_agent TEXT,
  ADD COLUMN IF NOT EXISTS locked_at        TIMESTAMPTZ;

-- Backfill signing_token for existing rows that may have NULL
UPDATE document_requests
SET signing_token = id
WHERE signing_token IS NULL;

-- 2. Extend signed_documents with new columns
ALTER TABLE signed_documents
  ADD COLUMN IF NOT EXISTS document_hash   TEXT,
  ADD COLUMN IF NOT EXISTS signature_type  TEXT DEFAULT 'draw'
    CHECK (signature_type IN ('draw', 'typed', 'uploaded'));

-- 3. signing_audit_log — captures every significant action
CREATE TABLE IF NOT EXISTS signing_audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES document_requests(id) ON DELETE CASCADE,
  action          TEXT NOT NULL
                    CHECK (action IN ('viewed', 'field_updated', 'progress_saved', 'signed', 'locked', 'downloaded')),
  ip_address      TEXT,
  user_agent      TEXT,
  metadata        JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_document_id ON signing_audit_log(document_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action      ON signing_audit_log(action);

-- 4. document_versions — tracks version history
CREATE TABLE IF NOT EXISTS document_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES document_requests(id) ON DELETE CASCADE,
  version_number  INT NOT NULL DEFAULT 1,
  file_url        TEXT NOT NULL,
  document_hash   TEXT,
  created_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_document_versions_doc ON document_versions(document_id);

-- =============================================================
-- Row Level Security
-- =============================================================

ALTER TABLE signing_audit_log  ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions  ENABLE ROW LEVEL SECURITY;

-- Anonymous can read audit logs for their document (needed by client page)
CREATE POLICY "Allow anonymous read on signing_audit_log"
  ON signing_audit_log FOR SELECT TO anon USING (true);

-- Anonymous can insert audit events (view/field_updated/progress_saved)
CREATE POLICY "Allow anonymous insert on signing_audit_log"
  ON signing_audit_log FOR INSERT TO anon WITH CHECK (
    action IN ('viewed', 'field_updated', 'progress_saved')
  );

-- Service role full access
CREATE POLICY "Service role full access on signing_audit_log"
  ON signing_audit_log FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous read on document_versions"
  ON document_versions FOR SELECT TO anon USING (true);

CREATE POLICY "Service role full access on document_versions"
  ON document_versions FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Allow anonymous to update form_field_responses (for auto-save)
CREATE POLICY "Allow anonymous update form_field_responses"
  ON document_requests FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- =============================================================
-- Done
-- =============================================================
