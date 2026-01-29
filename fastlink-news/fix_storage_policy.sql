-- Allow public (anon) uploads to storage buckets
-- Run this in your Supabase SQL Editor

-- 1. Images Bucket
DROP POLICY IF EXISTS "Authenticated Uploads Images" ON storage.objects;

CREATE POLICY "Public Uploads Images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'article-images' );

-- 2. Media Bucket
DROP POLICY IF EXISTS "Authenticated Uploads Media" ON storage.objects;

CREATE POLICY "Public Uploads Media"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'article-media' );
