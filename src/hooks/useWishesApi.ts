import { useAuth } from '@clerk/nextjs';
import { Wish, CreateWishData, UpdateWishData } from '@/services/api/wishes';

// バックエンドAPIのベースURL（環境変数またはデフォルト値）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export function useWishesApi() {
  const { getToken } = useAuth();

  // 認証ヘッダーを取得する関数
  const getAuthHeaders = async (): Promise<HeadersInit> => {
    try {
      const token = await getToken({ template: 'backend-taine' });
      if (token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    
    return { 'Content-Type': 'application/json' };
  };

  return {
    // Wish一覧取得
    getWishes: async (organizationId: string): Promise<Wish[]> => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/wishes`, {
        headers,
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: `${API_BASE_URL}/organizations/${organizationId}/wishes`
        });
        throw new Error(`Failed to fetch wishes: ${response.statusText} - ${errorText}`);
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
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to create wish: ${response.statusText} - ${errorText}`);
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
    updateWishesOrder: async (wishes: Array<{ id: string; order_no: number }>): Promise<void> => {
      // 各Wishの順序を個別に更新
      const headers = await getAuthHeaders();
      const updatePromises = wishes.map(wish => 
        fetch(`${API_BASE_URL}/wishes/${wish.id}/order`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ order_no: wish.order_no }),
        })
      );
      const responses = await Promise.all(updatePromises);
      
      // エラーチェック
      const failedResponses = responses.filter(r => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error('Failed to update some wish orders');
      }
    },
  };
}