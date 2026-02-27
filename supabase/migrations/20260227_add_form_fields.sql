-- =============================================
-- Add form_fields column to document_requests
-- Allows admin to define dynamic fillable fields per document
-- =============================================

ALTER TABLE document_requests
ADD COLUMN IF NOT EXISTS form_fields JSONB DEFAULT '[]'::jsonb;

-- Example usage:
-- UPDATE document_requests SET form_fields = '[
--   {"id": "host_name", "label": "Full Name", "type": "text", "required": true},
--   {"id": "id_number", "label": "National ID No.", "type": "text", "required": true},
--   {"id": "vehicle_make", "label": "Vehicle Make & Model", "type": "text", "required": true},
--   {"id": "reg_number", "label": "Registration Number", "type": "text", "required": true},
--   {"id": "agreement_date", "label": "Agreement Date", "type": "date", "required": true},
--   {"id": "compensation_model", "label": "Compensation Model", "type": "select", "required": true, "options": ["Revenue Share", "Fixed Lease"]}
-- ]' WHERE id = '<document_id>';
