export const getApiUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}

export const getSiteUrl = (path: string = '') => {
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
}

export const getStorageUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_STORAGE_URL}${path}`
} 