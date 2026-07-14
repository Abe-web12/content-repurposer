
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tone_profile: Record<string, unknown>;
  plan: "free" | "starter" | "pro";
  generations_used: number;
  generations_limit: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VoiceProfile {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tone: "formal" | "casual" | "witty" | "authoritative" | "friendly";
  example_posts: string[];
  embedding: number[] | null;
  is_default: boolean;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  input_type: "youtube_url" | "blog_url" | "podcast_url" | "raw_text";
  input_content: string;
  extracted_content: string | null;
  output_format: "linkedin_post" | "linkedin_carousel" | "twitter_thread";
  output_content: string;
  voice_profile_id: string | null;
  voice_profile?: VoiceProfile | null;
  tokens_used: number | null;
  model_used: string | null;
  is_favorite: boolean;
  created_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  generation_id: string | null;
  action: "generation" | "regeneration";
  credits_consumed: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      voice_profiles: {
        Row: VoiceProfile;
        Insert: Omit<VoiceProfile, "id" | "created_at">;
        Update: Partial<Omit<VoiceProfile, "id" | "user_id" | "created_at">>;
      };
      generations: {
        Row: Generation;
        Insert: Omit<Generation, "id" | "created_at" | "voice_profile">;
        Update: Partial<Omit<Generation, "id" | "user_id" | "created_at">>;
      };
      usage_log: {
        Row: UsageLog;
        Insert: Omit<UsageLog, "id" | "created_at">;
        Update: never;
      };
    };
  };
}