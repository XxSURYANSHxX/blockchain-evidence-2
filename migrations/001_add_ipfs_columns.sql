-- Database Migration: Add IPFS columns to evidence table
-- Run this in Supabase SQL Editor

DO $$
BEGIN
    -- Check if ipfs_cid column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'ipfs_cid') THEN
        ALTER TABLE evidence ADD COLUMN ipfs_cid TEXT;
    END IF;

    -- Check if ipfs_gateway_url column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'ipfs_gateway_url') THEN
        ALTER TABLE evidence ADD COLUMN ipfs_gateway_url TEXT;
    END IF;

    -- Check if ipfs_pinned_until column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'ipfs_pinned_until') THEN
        ALTER TABLE evidence ADD COLUMN ipfs_pinned_until TIMESTAMPTZ;
    END IF;

    -- Check if ipfs_status column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evidence' AND column_name = 'ipfs_status') THEN
        ALTER TABLE evidence ADD COLUMN ipfs_status TEXT DEFAULT 'pending' 
        CHECK (ipfs_status IN ('pending', 'uploaded', 'pinned', 'failed'));
    END IF;
END $$;

-- Create index for faster CID lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_evidence_ipfs_cid ON evidence(ipfs_cid);
