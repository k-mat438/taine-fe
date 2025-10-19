'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuth } from '@clerk/nextjs';
import { Pencil, Check, Circle, Loader2, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Wish, WishesResponse, ChecklistItem } from '@/types/edit/wish';
import {
  WISHES_ENDPOINT,
  wishesFetcher,
  createWish,
} from '@/lib/fetcher/wishes';

export default function EditPage() {
  const { getToken } = useAuth();
  // チェック状態を管理するためのローカルステート
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // 新規Wish追加用のステート
  const [isAddingWish, setIsAddingWish] = useState(false);
  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishNote, setNewWishNote] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // SWRを使用してデータを取得
  const { data, error, isLoading } = useSWR<WishesResponse>(
    WISHES_ENDPOINT,
    (url) => wishesFetcher(url, getToken),
    {
      revalidateOnFocus: false, // フォーカス時の再検証を無効化
      revalidateOnReconnect: false, // 再接続時の再検証を無効化
    }
  );

  // 入力フィールドにフォーカスを当てる
  useEffect(() => {
    if (isAddingWish && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingWish]);

  // APIのレスポンスをChecklistItem形式に変換
  const items: ChecklistItem[] =
    data?.wishes?.map((wish: Wish) => ({
      id: wish.id,
      text: wish.title,
      note: wish.note,
      checked: checkedItems.has(wish.id),
      avatars: ['👨‍🦱', '👩‍🦱'], // デフォルトのアバター
    })) || [];

  // 新規Wish作成処理
  const handleCreateWish = async () => {
    if (!newWishTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const token = await getToken({ template: 'backend-taine' });
      await createWish(token, newWishTitle, newWishNote);

      // SWRのキャッシュを更新してデータを再取得
      await mutate(WISHES_ENDPOINT);

      // フォームをリセット
      setNewWishTitle('');
      setNewWishNote('');
      setIsAddingWish(false);
    } catch (error) {
      console.error('Failed to create wish:', error);
      // エラー処理（必要に応じてトーストやアラートを表示）
    } finally {
      setIsCreating(false);
    }
  };

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* タイトル部分 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            〇〇したいね、行きたいね
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsAddingWish(!isAddingWish)}
          >
            {isAddingWish ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Pencil className="w-5 h-5 text-foreground" />
            )}
          </Button>
        </div>

        {/* 新規Wish追加フォーム */}
        {isAddingWish && (
          <Card className="mb-4 border-primary/20">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="やりたいことを入力..."
                  value={newWishTitle}
                  onChange={(e) => setNewWishTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateWish();
                    }
                  }}
                  disabled={isCreating}
                  className="w-full"
                />
                <Input
                  type="text"
                  placeholder="メモ（任意）"
                  value={newWishNote}
                  onChange={(e) => setNewWishNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCreateWish();
                    }
                  }}
                  disabled={isCreating}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateWish}
                    disabled={!newWishTitle.trim() || isCreating}
                    size="sm"
                    className="flex-1"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        作成中...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        追加
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingWish(false);
                      setNewWishTitle('');
                      setNewWishNote('');
                    }}
                    disabled={isCreating}
                    variant="outline"
                    size="sm"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* アイテムリスト */}
        {!isLoading && !error && (
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Wishがまだありません</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* チェックボックス */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.checked ? (
                            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>

                        {/* テキスト */}
                        <div className="flex-1">
                          <div>
                            <span className="text-foreground">{item.text}</span>
                            {item.note && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* アバター */}
                        <div className="flex -space-x-1">
                          {item.avatars.map((avatar, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs"
                            >
                              {avatar}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* サブアイテム */}
                  {item.subItems && (
                    <div className="ml-6 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <Card
                          key={subItem.id}
                          className="hover:shadow-sm transition-shadow"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 p-0"
                                onClick={() => toggleItem(subItem.id)}
                              >
                                {subItem.checked ? (
                                  <div className="w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <Check className="w-2 h-2 text-white" />
                                  </div>
                                ) : (
                                  <Circle className="w-3 h-3 text-muted-foreground" />
                                )}
                              </Button>

                              <div className="flex-1">
                                <span className="text-sm text-muted-foreground">
                                  {subItem.text}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
