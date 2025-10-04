"use client";

import { useState } from 'react';
import { Pencil, Check, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
  avatars: string[];
  subItems?: ChecklistItem[];
}

export default function EditPage() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 1,
      text: "大学の友達とお泊り",
      checked: false,
      avatars: ["👩‍🦱"]
    },
    {
      id: 2,
      text: "夜の水族館でクラゲを見...",
      checked: true,
      avatars: ["👨‍🦱", "👩‍🦱"]
    },
    {
      id: 3,
      text: "草津で湯めぐり",
      checked: false,
      avatars: ["👨‍🦱", "👩‍🦱"],
      subItems: [
        {
          id: 31,
          text: "ホテル予約",
          checked: true,
          avatars: []
        },
        {
          id: 32,
          text: "夜行バス予約",
          checked: false,
          avatars: []
        }
      ]
    }
  ]);

  const toggleItem = (id: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.map(subItem => 
            subItem.id === id ? { ...subItem, checked: !subItem.checked } : subItem
          )
        };
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* タイトル部分 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            〇〇したいね、行きたいね
          </h1>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="w-5 h-5 text-foreground" />
          </Button>
        </div>
        
        {/* アイテムリスト */}
        <div className="space-y-3">
          {items.map((item) => (
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
                      <span className="text-foreground">{item.text}</span>
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
                    <Card key={subItem.id} className="hover:shadow-sm transition-shadow">
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
                            <span className="text-sm text-muted-foreground">{subItem.text}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
