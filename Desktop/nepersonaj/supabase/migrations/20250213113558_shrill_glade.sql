/*
  # Enhance blog posts with SEO and multiple images

  1. Changes
    - Add SEO fields to blog_posts:
      - meta_title
      - meta_description
      - meta_keywords
      - og_image
      - canonical_url
    - Create blog_post_images table for multiple images
      - id (primary key)
      - post_id (foreign key)
      - image_url
      - alt_text
      - sort_order
*/

-- Add SEO fields to blog_posts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text[],
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS canonical_url text;

-- Create blog_post_images table
CREATE TABLE IF NOT EXISTS blog_post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_post_images ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_post_images
CREATE POLICY "Allow public read access" ON blog_post_images
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage blog post images" ON blog_post_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_blog_post_images_updated_at
  BEFORE UPDATE ON blog_post_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();