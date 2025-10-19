'use client';

import { FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NotesPage() {
  const notes = [
    {
      id: 1,
      title: '今日の振り返り',
      content: '今日は良い一日だった',
      date: '2024-01-15',
      category: '日記',
    },
    {
      id: 2,
      title: 'アイデアメモ',
      content: '新しいプロジェクトのアイデア',
      date: '2024-01-14',
      category: 'アイデア',
    },
    {
      id: 3,
      title: '買い物リスト',
      content: '牛乳、パン、卵',
      date: '2024-01-13',
      category: 'リスト',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">ノート</h1>
          </div>
          <Button size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <Badge variant="secondary">{note.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {note.content}
                </p>
                <p className="text-xs text-muted-foreground">{note.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
