'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tweet, getAllTweets, getMyTweets, ApiError } from '@/lib/api';
import { useUser, useAuth } from '@clerk/nextjs';

interface TweetListProps {
  refreshTrigger: number;
}

export function TweetList({ refreshTrigger }: TweetListProps) {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [allTweets, setAllTweets] = useState<Tweet[]>([]);
  const [myTweets, setMyTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const loadTweets = async () => {
    if (!isSignedIn) {
      setError('ログインが必要です');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError('認証トークンの取得に失敗しました');
        setIsLoading(false);
        return;
      }

      const [allTweetsData, myTweetsData] = await Promise.all([
        getAllTweets(token),
        getMyTweets(token)
      ]);
      
      
      setAllTweets(allTweetsData);
      setMyTweets(myTweetsData);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError('認証が必要です。ログインしてください。');
        } else {
          setError(`エラー: ${error.message}`);
        }
      } else {
        setError('Tweetの読み込みに失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTweets();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyTweet = (tweet: Tweet) => {
    // デバッグ用ログ
    console.log('Clerk user ID:', user?.id);
    console.log('Tweet sub_id:', tweet.sub_id);
    console.log('Are they equal?', user?.id === tweet.sub_id);
    
    return user?.id === tweet.sub_id;
  };

  const currentTweets = activeTab === 'all' ? allTweets : myTweets;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadTweets} variant="outline">
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* タブ切り替え */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('all')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          全Tweet ({allTweets.length})
        </Button>
        <Button
          variant={activeTab === 'my' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('my')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          自分のTweet ({myTweets.length})
        </Button>
      </div>

      {/* ローディング状態 */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      )}

      {/* Tweet一覧 */}
      {!isLoading && (
        <div className="space-y-4">
          {currentTweets.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  {activeTab === 'all' ? 'まだTweetがありません' : 'あなたのTweetがありません'}
                </p>
              </CardContent>
            </Card>
          ) : (
            currentTweets
              .sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
              })
              .map((tweet, index) => (
                <Card key={tweet.id || `tweet-${index}`} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={isMyTweet(tweet) ? 'default' : 'secondary'}>
                          {isMyTweet(tweet) ? 'あなた' : '他のユーザー'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {tweet.created_at ? formatDate(tweet.created_at) : '日時不明'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {tweet.id ? tweet.id.slice(0, 8) : 'N/A'}...
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap break-words">
                      {tweet.content || '内容がありません'}
                    </p>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
}
