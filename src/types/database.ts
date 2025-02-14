export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  og_image: string | null;
  og_description: string | null;
  canonical_url: string | null;
  status: 'draft' | 'published';
  slug: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
  technologies?: ProjectTechnology[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTechnology {
  id: string;
  project_id: string;
  name: string;
  icon_url: string | null;
  color: string | null;
  sort_order: number;
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
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  telegram_url: string | null;
  whatsapp_url: string | null;
  youtube_url: string | null;
  vk_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  email: string | null;
  phone: string | null;
  show_telegram: boolean;
  show_whatsapp: boolean;
  show_youtube: boolean;
  show_vk: boolean;
  show_twitter: boolean;
  show_instagram: boolean;
  show_email: boolean;
  show_phone: boolean;
  text_ai_provider: string;
  text_ai_model: string;
  text_ai_api_key: string | null;
  text_ai_endpoint_url: string | null;
  text_ai_temperature: number;
  text_ai_max_tokens: number;
  storage_provider: string;
  storage_api_key: string | null;
  storage_endpoint_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerationStatus {
  field: string;
  progress: number;
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
}