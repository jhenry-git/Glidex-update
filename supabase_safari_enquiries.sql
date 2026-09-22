-- Migration: Create safari_enquiries table for Google Ads & Safari tour leads
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.safari_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    safari_package TEXT,
    travel_date TEXT,
    group_size TEXT,
    vehicle_preference TEXT,
    notes TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    gclid TEXT,
    status TEXT NOT NULL DEFAULT 'new'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.safari_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors (landing page leads) to insert new enquiries
CREATE POLICY "Allow public insert to safari_enquiries"
    ON public.safari_enquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated admins to view/manage enquiries
CREATE POLICY "Allow authenticated users to read safari_enquiries"
    ON public.safari_enquiries
    FOR SELECT
    TO authenticated
    USING (true);

-- Create index on created_at and status for fast dashboard querying
CREATE INDEX IF NOT EXISTS idx_safari_enquiries_created_at ON public.safari_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safari_enquiries_status ON public.safari_enquiries (status);
