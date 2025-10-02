import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <div className="max-w-screen-sm mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">ホーム</h1>
      <p className="text-center text-stone-600 mb-6">
        下のナビゲーションバーから各機能にアクセスできます
      </p>
      
      {/* shadcn/ui コンポーネントのテスト */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>shadcn/ui テスト</CardTitle>
          <CardDescription>
            shadcn/uiコンポーネントが正しく動作していることを確認できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button>デフォルト</Button>
            <Button variant="secondary">セカンダリ</Button>
            <Button variant="outline">アウトライン</Button>
          </div>
          <div className="flex gap-2">
            <Badge>デフォルト</Badge>
            <Badge variant="secondary">セカンダリ</Badge>
            <Badge variant="outline">アウトライン</Badge>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">ダイアログを開く</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ダイアログのテスト</DialogTitle>
                  <DialogDescription>
                    これはshadcn/uiのDialogコンポーネントのテストです。
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>ダイアログが正常に動作しています！</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
