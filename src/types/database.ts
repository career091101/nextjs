export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          subject: string
          message: string
          status: 'new' | 'read' | 'replied'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          subject: string
          message: string
          status?: 'new' | 'read' | 'replied'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: 'new' | 'read' | 'replied'
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          excerpt: string
          slug: string
          published: boolean
          category: string
          author_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          excerpt: string
          slug: string
          published?: boolean
          category: string
          author_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          published?: boolean
          category?: string
          author_id?: string
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'admin'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 