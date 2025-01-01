import { NextResponse } from 'next/server';
import { z } from 'zod';

// 外部APIのレスポンス型定義
interface ExternalAPIResponse {
  data: any;
  status: number;
  message?: string;
}

// エラーレスポンスの型定義
interface ErrorResponse {
  error: string;
  status: number;
}

// リクエストの検証スキーマ
const requestSchema = z.object({
  endpoint: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  params: z.record(z.any()).optional(),
  headers: z.record(z.string()).optional(),
});

/**
 * 外部APIへのリクエストを処理する関数
 */
async function fetchExternalAPI(
  endpoint: string,
  method: string,
  params?: Record<string, any>,
  headers?: Record<string, string>
): Promise<ExternalAPIResponse> {
  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (params && method !== 'GET') {
      requestOptions.body = JSON.stringify(params);
    }

    if (params && method === 'GET') {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }

    const response = await fetch(endpoint, requestOptions);
    const data = await response.json();

    return {
      data,
      status: response.status,
      message: response.statusText,
    };
  } catch (error) {
    console.error('External API Error:', error);
    throw error;
  }
}

/**
 * エラーレスポンスを生成する関数
 */
function createErrorResponse(message: string, status: number): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { error: message, status },
    { status }
  );
}

/**
 * 外部APIエンドポイントのGETハンドラー
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return createErrorResponse('Endpoint parameter is required', 400);
    }

    const params = Object.fromEntries(searchParams);
    delete params.endpoint;

    const validation = requestSchema.safeParse({
      endpoint,
      method: 'GET',
      params,
    });

    if (!validation.success) {
      return createErrorResponse('Invalid request parameters', 400);
    }

    const result = await fetchExternalAPI(endpoint, 'GET', params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('External API Handler Error:', error);
    return createErrorResponse('External API request failed', 500);
  }
}

/**
 * 外部APIエンドポイントのPOSTハンドラー
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = requestSchema.safeParse(body);
    
    if (!validation.success) {
      return createErrorResponse('Invalid request body', 400);
    }

    const { endpoint, method, params, headers } = validation.data;
    const result = await fetchExternalAPI(endpoint, method, params, headers);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('External API Handler Error:', error);
    return createErrorResponse('External API request failed', 500);
  }
}

// レート制限の設定
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
    // レート制限を設定（例：1分間に60リクエストまで）
    rateLimit: {
      windowMs: 60 * 1000,
      max: 60
    }
  }
};