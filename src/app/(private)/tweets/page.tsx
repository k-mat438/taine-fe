'use client';

import { useState } from 'react';
import { TweetForm } from '@/components/tweet-form';
import { TweetList } from '@/components/tweet-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@clerk/nextjs';

export default function TweetsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, isLoaded } = useUser();

  const handleTweetCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tweet機能</h1>
        <p className="text-gray-600 mb-4">
          認証テスト機能付きのTweetアプリケーションです
        </p>
        
        {/* 認証状態の表示 */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">認証状態</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="default">ログイン済み</Badge>
                <span className="text-sm text-gray-600">
                  ClerkユーザーID: {user.id}
                </span>
              </div>
              <div className="mt-2">
                {/* <span className="text-sm text-gray-600">
                  全ユーザー情報: {JSON.stringify(user, null, 2)}
                </span> */}
              </div>
              {user.fullName && (
                <p className="text-sm text-gray-600 mt-2">
                  名前: {user.fullName}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tweet作成フォーム */}
      <TweetForm onTweetCreated={handleTweetCreated} />

      {/* Tweet一覧 */}
      <TweetList refreshTrigger={refreshTrigger} />

      {/* テストシナリオの説明 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">テストシナリオ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">1. 複数ユーザーでのテスト</h4>
              <p className="text-gray-600">
                異なるユーザーアカウントでログインしてTweetを作成し、
                認証が正しく動作することを確認してください。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">2. 全Tweet取得テスト</h4>
              <p className="text-gray-600">
                「全Tweet」タブで他のユーザーのTweetも含めて
                全てのTweetが取得できることを確認してください。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">3. 自分のTweet取得テスト</h4>
              <p className="text-gray-600">
                「自分のTweet」タブで自分のTweetのみが
                取得できることを確認してください。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">4. エラーハンドリングテスト</h4>
              <p className="text-gray-600">
                ログアウト後にアクセスして401エラーが
                適切に表示されることを確認してください。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
