'use client';

import {
  Settings,
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const settingsItems = [
    {
      icon: User,
      title: 'プロフィール',
      description: '個人情報の管理',
      href: '/settings/profile',
    },
    {
      icon: Users,
      title: '組織・招待',
      description: 'チームメンバーの管理と招待',
      href: '/settings/organization',
    },
    {
      icon: Bell,
      title: '通知',
      description: '通知設定の管理',
      href: null,
    },
    {
      icon: Shield,
      title: 'プライバシー',
      description: 'プライバシー設定',
      href: null,
    },
    {
      icon: HelpCircle,
      title: 'ヘルプ',
      description: 'サポートとヘルプ',
      href: null,
    },
  ];

  const handleItemClick = (href: string | null) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-foreground" />
          <h1 className="text-2xl font-bold text-foreground">設定</h1>
        </div>

        <div className="space-y-3">
          {settingsItems.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick(item.href)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="destructive" className="w-full" size="lg">
            <LogOut className="w-5 h-5 mr-2" />
            ログアウト
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>アプリバージョン 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
