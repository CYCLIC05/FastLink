-- Create a table for posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null,
  content text,
  image_url text,
  media_url text, -- For Video/Audio
  is_trending boolean default false,
  author text not null,
  status text default 'draft' check (status in ('draft', 'published', 'rejected', 'archived')),
  user_id uuid references auth.users(id)
);

-- Turn on Row Level Security
alter table posts enable row level security;

-- Allow public read access to published posts
create policy "Public posts are viewable by everyone."
  on posts for select
  using ( status = 'published' );

-- Allow authenticated users to insert posts
create policy "Users can insert their own posts."
  on posts for insert
  with check ( auth.uid() = user_id );

-- Allow users to update their own posts
create policy "Users can update own posts."
  on posts for update
  using ( auth.uid() = user_id );

-- Allow users to delete their own posts
create policy "Users can delete own posts."
  on posts for delete
  using ( auth.uid() = user_id );

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('article-images', 'article-images', true);
insert into storage.buckets (id, name, public) values ('article-media', 'article-media', true);

-- Allow public access to the buckets
create policy "Public Access Images"
  on storage.objects for select
  using ( bucket_id = 'article-images' );

create policy "Public Access Media"
  on storage.objects for select
  using ( bucket_id = 'article-media' );

-- Allow authenticated uploads
create policy "Authenticated Uploads Images"
  on storage.objects for insert
  with check ( bucket_id = 'article-images' and auth.role() = 'authenticated' );

create policy "Authenticated Uploads Media"
  on storage.objects for insert
  with check ( bucket_id = 'article-media' and auth.role() = 'authenticated' );
