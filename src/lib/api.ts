const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : 'http://localhost:3001/api/v1';

export interface Tweet {
  id: string;
  sub_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TweetResponse {
  tweets: Tweet[];
}

export interface CreateTweetRequest {
  content: string;
}

// Tweet作成
export async function createTweet(
  content: string,
  token: string
): Promise<Tweet> {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}/tweets`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        errorText || 'Tweetの作成に失敗しました',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('ネットワークエラーが発生しました', 0);
  }
}

// 全Tweet一覧取得
export async function getAllTweets(token: string): Promise<Tweet[]> {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}/tweets`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        errorText || 'Tweetの取得に失敗しました',
        response.status
      );
    }

    const data = await response.json();

    // レスポンス構造をチェック
    if (data.tweets && Array.isArray(data.tweets)) {
      return data.tweets;
    } else if (Array.isArray(data)) {
      // レスポンスが直接配列の場合
      return data;
    } else {
      console.error('Unexpected response structure:', data);
      throw new ApiError('予期しないレスポンス形式です', 500);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('ネットワークエラーが発生しました', 0);
  }
}

// 自分のTweet一覧取得
export async function getMyTweets(token: string): Promise<Tweet[]> {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}/tweets/my`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        errorText || '自分のTweetの取得に失敗しました',
        response.status
      );
    }

    const data = await response.json();

    // レスポンス構造をチェック
    if (data.tweets && Array.isArray(data.tweets)) {
      return data.tweets;
    } else if (Array.isArray(data)) {
      // レスポンスが直接配列の場合
      return data;
    } else {
      console.error('Unexpected my tweets response structure:', data);
      throw new ApiError('予期しないレスポンス形式です', 500);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('ネットワークエラーが発生しました', 0);
  }
}

// カスタムエラークラス
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
