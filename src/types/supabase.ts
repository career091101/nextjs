// frontend/types/supabase.ts

/**
 * Supabase Database Types
 * Generated types for Supabase tables and views
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          slug: string;
          author_id: string;
          created_at: string;
          updated_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          slug: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          slug?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          role: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
          role?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
          role?: string;
        };
      };
    };
    Views: {
      // ビューの定義がある場合はここに追加
    };
    Functions: {
      // カスタム関数の定義がある場合はここに追加
    };
    Enums: {
      user_role: 'admin' | 'user' | 'editor';
    };
  };
}

/**
 * Helper types for Supabase tables
 */
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][T];

// Posts related types
export type Post = Tables<'posts'>;
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

// Users related types
export type User = Tables<'users'>;
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

/**
 * Type guards for runtime type checking
 */
export const isPost = (obj: unknown): obj is Post => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'content' in obj &&
    'slug' in obj &&
    'author_id' in obj
  );
};

export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj
  );
};