// Wishの型定義
export interface Wish {
  id: string;
  organization_id: string;
  title: string;
  note: string;
  order_no: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Wish作成時のデータ型
export interface CreateWishData {
  organization_id: string;
  title: string;
  note?: string;
  order_no?: number;
}

// Wish更新時のデータ型
export interface UpdateWishData {
  title?: string;
  note?: string;
  order_no?: number;
}

// バックエンドAPIのベースURL（環境変数またはデフォルト値）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Clerkの型定義を拡張
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options?: { template?: string }) => Promise<string | null>;
      };
    };
  }
}

// 認証ヘッダーを取得する関数（クライアントサイド用）
async function getAuthHeaders(): Promise<HeadersInit> {
  if (typeof window === 'undefined') {
    // サーバーサイドの場合
    return { 'Content-Type': 'application/json' };
  }

  // クライアントサイドの場合、ClerkのトークンをSessionから取得
  try {
    const token = await window.Clerk?.session?.getToken({
      template: 'backend-taine',
    });
    if (token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }

  return { 'Content-Type': 'application/json' };
}

// API関数
export const wishesApi = {
  // Wish一覧取得
  getWishes: async (organizationId: string): Promise<Wish[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/wishes`,
      {
        headers,
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch wishes: ${response.statusText}`);
    }
    return response.json();
  },

  // Wish作成
  createWish: async (data: CreateWishData): Promise<Wish> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create wish: ${response.statusText}`);
    }
    return response.json();
  },

  // 単一のWish取得
  getWish: async (id: string): Promise<Wish> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes/${id}`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch wish: ${response.statusText}`);
    }
    return response.json();
  },

  // Wish更新
  updateWish: async (id: string, data: UpdateWishData): Promise<Wish> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update wish: ${response.statusText}`);
    }
    return response.json();
  },

  // Wish削除（物理削除）
  deleteWish: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to delete wish: ${response.statusText}`);
    }
  },

  // Wishソフトデリート
  softDeleteWish: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes/${id}/soft-delete`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to soft delete wish: ${response.statusText}`);
    }
  },

  // Wish復元
  restoreWish: async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes/${id}/restore`, {
      method: 'POST',
      headers,
    });
    if (!response.ok) {
      throw new Error(`Failed to restore wish: ${response.statusText}`);
    }
  },

  // 並び順更新
  updateWishOrder: async (id: string, orderNo: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/wishes/${id}/order`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ order_no: orderNo }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update wish order: ${response.statusText}`);
    }
  },

  // 複数のWishの並び順を一括更新
  updateWishesOrder: async (
    wishes: Array<{ id: string; order_no: number }>
  ): Promise<void> => {
    // 各Wishの順序を個別に更新
    const updatePromises = wishes.map((wish) =>
      wishesApi.updateWishOrder(wish.id, wish.order_no)
    );
    await Promise.all(updatePromises);
  },
};
