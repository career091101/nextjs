// types/index.ts

/**
 * 投稿の型定義
 */
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  author_id: string;
  created_at: Date;
  updated_at: Date;
  published: boolean;
  category_id?: string;
  excerpt?: string;
  featured_image?: string;
  tags?: string[];
}

/**
 * ユーザーの型定義
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
  role: 'admin' | 'author' | 'subscriber';
  bio?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

/**
 * コメントの型定義
 */
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  parent_id?: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * カテゴリーの型定義
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * ダッシュボード統計の型定義
 */
export interface DashboardStats {
  posts: {
    total: number;
    published: number;
    draft: number;
    views: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
  };
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  engagement: {
    average_time_on_page: number;
    bounce_rate: number;
    conversion_rate: number;
  };
}

/**
 * API レスポンスの型定義
 */
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

/**
 * ページネーションの型定義
 */
export interface PaginationParams {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * 検索クエリの型定義
 */
export interface SearchQuery {
  query: string;
  filters?: {
    category?: string;
    author?: string;
    date_range?: {
      start: Date;
      end: Date;
    };
    tags?: string[];
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

/**
 * エラーの型定義
 */
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// 型ガード関数
export const isPost = (obj: unknown): obj is Post => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'content' in obj
  );
};

export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj
  );
};