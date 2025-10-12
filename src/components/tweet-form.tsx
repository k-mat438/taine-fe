'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTweet, ApiError } from '@/lib/api';

interface TweetFormProps {
  onTweetCreated: () => void;
}

export function TweetForm({ onTweetCreated }: TweetFormProps) {
  const { getToken, isSignedIn } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      setError('ログインが必要です');
      return;
    }
    
    if (!content.trim()) {
      setError('Tweetの内容を入力してください');
      return;
    }

    if (content.length > 280) {
      setError('Tweetは280文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getToken();
      if (!token) {
        setError('認証トークンの取得に失敗しました');
        return;
      }

      await createTweet(content, token);
      setContent('');
      setSuccess('Tweetが作成されました！');
      onTweetCreated();
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError('認証が必要です。ログインしてください。');
        } else {
          setError(`エラー: ${error.message}`);
        }
      } else {
        setError('予期しないエラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error) setError(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>新しいTweet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="何を考えていますか？"
              value={content}
              onChange={handleContentChange}
              className="min-h-[100px] resize-none"
              maxLength={280}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${content.length > 260 ? 'text-red-500' : 'text-gray-500'}`}>
                {content.length}/280
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="w-full"
          >
            {isSubmitting ? '投稿中...' : 'Tweetを投稿'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
