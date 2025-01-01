export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
}; 