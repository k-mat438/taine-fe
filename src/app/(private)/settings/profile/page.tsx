'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  Camera,
  Mail,
  User,
  Calendar,
  Shield,
  Link2,
  Smartphone,
  Key,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ユーザー情報が読み込まれたら初期値を設定
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await user.update({
        firstName: firstName,
        lastName: lastName,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('プロフィールの更新に失敗しました:', error);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">
          ユーザー情報が見つかりません
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">プロフィール</h1>
        </div>

        {/* プロフィール画像セクション */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="プロフィール画像"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                  variant="secondary"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-4 text-lg font-semibold">
                {user.fullName || 'ユーザー'}
              </p>
              <p className="text-sm text-muted-foreground">
                @{user.username || user.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 基本情報セクション */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">名</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="名を入力"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">姓</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="姓を入力"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="flex-1">
                    保存
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">氏名</p>
                    <p className="font-medium">{user.fullName || '未設定'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      メールアドレス
                    </p>
                    <p className="font-medium">
                      {user.primaryEmailAddress?.emailAddress || '未設定'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full mt-2"
                >
                  編集
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* アカウント情報セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">アカウント情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">登録日</p>
                <p className="font-medium">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('ja-JP')
                    : '不明'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">アカウントID</p>
                <p className="font-medium text-xs">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 連携アカウント */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">連携アカウント</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.externalAccounts && user.externalAccounts.length > 0 ? (
              user.externalAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">
                        {account.provider}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {account.emailAddress || account.username || '連携済み'}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  外部アカウントが連携されていません
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Googleと連携
                  </Button>
                  <Button variant="outline" className="w-full">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHubと連携
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* セキュリティ設定 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">セキュリティ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 2要素認証 */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">2要素認証</p>
                  <p className="text-sm text-muted-foreground">
                    アカウントのセキュリティを強化
                  </p>
                </div>
              </div>
              {user.twoFactorEnabled ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Button variant="outline" size="sm">
                    無効化
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm">
                  有効化
                </Button>
              )}
            </div>

            {/* パスワード変更 */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">パスワード</p>
                  <p className="text-sm text-muted-foreground">
                    定期的に変更することを推奨します
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                変更
              </Button>
            </div>

            {/* セッション管理 */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">アクティブセッション</p>
                  <p className="text-sm text-muted-foreground">
                    現在ログイン中のデバイス
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                管理
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* メール設定 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">メールアドレス</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.emailAddresses &&
              user.emailAddresses.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{email.emailAddress}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {email.verification?.status === 'verified' ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            確認済み
                          </span>
                        ) : (
                          <span className="text-xs text-yellow-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            未確認
                          </span>
                        )}
                        {user.primaryEmailAddressId === email.id && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            プライマリ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {user.primaryEmailAddressId !== email.id && (
                    <Button variant="outline" size="sm">
                      プライマリに設定
                    </Button>
                  )}
                </div>
              ))}
            <Button variant="outline" className="w-full">
              メールアドレスを追加
            </Button>
          </CardContent>
        </Card>

        {/* 危険ゾーン */}
        <Card className="mt-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">
              危険ゾーン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              この操作は取り消すことができません。慎重に行ってください。
            </p>
            <Button variant="destructive" className="w-full">
              アカウントを削除
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
