export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  images?: BlogPostImage[];
}

export interface BlogPostImage {
  id: string;
  post_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  text_ai_provider: string;
  text_ai_model: string;
  text_ai_api_key: string | null;
  text_ai_endpoint_url: string | null;
  text_ai_temperature: number;
  text_ai_max_tokens: number;
  image_ai_provider: string;
  image_ai_model: string;
  image_ai_api_key: string | null;
  image_ai_endpoint_url: string | null;
  storage_provider: string;
  storage_api_key: string | null;
  storage_endpoint_url: string | null;
  created_at: string;
  updated_at: string;
}