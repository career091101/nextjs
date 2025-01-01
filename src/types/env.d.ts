declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string
      NEXT_PUBLIC_SITE_NAME: string
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      NEXT_PUBLIC_API_URL: string
      NEXT_PUBLIC_STORAGE_URL: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      [key: string]: string | undefined
    }
  }
}

export {} 