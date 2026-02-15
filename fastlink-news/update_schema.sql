-- Add views column to posts if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'views') THEN
        ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add tags column to posts if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'tags') THEN
        ALTER TABLE posts ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE
);

-- Turn on RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public comments are viewable by everyone." ON comments;
DROP POLICY IF EXISTS "Public can insert comments." ON comments;

-- Allow public read access to approved comments
CREATE POLICY "Public comments are viewable by everyone."
  ON comments FOR SELECT
  USING ( is_approved = true );

-- Allow anyone to insert comments
CREATE POLICY "Public can insert comments."
  ON comments FOR INSERT
  WITH CHECK ( true );
