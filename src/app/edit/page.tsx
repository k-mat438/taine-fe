"use client";

import { Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function EditPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Pencil className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl font-bold text-stone-800">編集</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>新しいノート</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">
                タイトル
              </label>
              <Input
                placeholder="タイトルを入力..."
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">
                内容
              </label>
              <Textarea
                placeholder="内容を入力..."
                className="min-h-32 resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button className="flex-1">
                保存
              </Button>
              <Button variant="outline" className="flex-1">
                キャンセル
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
