// APIのベースURL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// 汎用的なfetcher関数の型定義
export type FetcherOptions = {
  token?: string | null;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
};

// 汎用的なfetcher関数
export async function fetcher<T = unknown>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { token, method = 'GET', body, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // トークンがある場合はAuthorizationヘッダーを追加
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // bodyがある場合は追加
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  // レスポンスが空の場合の処理
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  return response.json();
}

// Clerk認証付きfetcher（SWR用）
export function createAuthenticatedFetcher<T = unknown>(
  getToken: (options?: { template?: string }) => Promise<string | null>
) {
  return async (url: string): Promise<T> => {
    const token = await getToken({ template: 'backend-taine' });
    return fetcher<T>(url, { token });
  };
}
