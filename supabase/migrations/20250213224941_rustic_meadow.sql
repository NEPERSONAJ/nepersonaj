/*
  # Update projects table with SEO fields and additional images

  1. Changes to projects table
    - Add SEO fields (meta_title, meta_description, meta_keywords)
    - Add OpenGraph fields (og_image, og_description)
    - Add canonical URL field
    - Add status field for draft/published state
    - Add slug field for URL-friendly names
    - Add featured flag for highlighting projects

  2. New Tables
    - project_images: Store multiple images per project
    - project_technologies: Store technology details

  3. Security
    - Enable RLS on new tables
    - Add policies for public and authenticated access
*/

-- Add SEO and additional fields to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS meta_keywords text[],
ADD COLUMN IF NOT EXISTS og_image text,
ADD COLUMN IF NOT EXISTS og_description text,
ADD COLUMN IF NOT EXISTS canonical_url text,
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- Create project_images table
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_technologies table
CREATE TABLE IF NOT EXISTS project_technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon_url text,
  color text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

-- Policies for project_images
CREATE POLICY "Allow public read access" ON project_images
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage project images" ON project_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for project_technologies
CREATE POLICY "Allow public read access" ON project_technologies
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage project technologies" ON project_technologies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_project_images_updated_at
  BEFORE UPDATE ON project_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_technologies_updated_at
  BEFORE UPDATE ON project_technologies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();