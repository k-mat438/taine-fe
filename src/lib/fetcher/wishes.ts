import type { WishesResponse } from '@/types/edit/wish';
import { API_BASE_URL, fetcher } from './index';

// Wishes APIのエンドポイント
export const WISHES_ENDPOINT = `${API_BASE_URL}/wishes`;

// SWR用のfetcher関数（認証トークン付き）- page.tsxで使用されているものと同じ
export const wishesFetcher = async (
  url: string,
  getToken: (options?: { template?: string }) => Promise<string | null>
): Promise<WishesResponse> => {
  // Clerkから認証トークンを取得
  const token = await getToken({ template: 'backend-taine' });

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // トークンがある場合はAuthorizationヘッダーを追加
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch wishes: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Wish作成関数（curlコマンドに基づく実装）
export async function createWish(
  token: string | null,
  title: string,
  note: string,
  order_no?: number
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/wish`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title,
      note,
      order_no: order_no || 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create wish: ${response.statusText}`);
  }
}

// Wish更新関数
export async function updateWish(
  token: string | null,
  id: string,
  title: string,
  note: string
): Promise<void> {
  await fetcher(`${WISHES_ENDPOINT}/${id}`, {
    token,
    method: 'PUT',
    body: { title, note },
  });
}

// Wish削除関数
export async function deleteWish(
  token: string | null,
  id: string
): Promise<void> {
  await fetcher(`${WISHES_ENDPOINT}/${id}`, {
    token,
    method: 'DELETE',
  });
}
