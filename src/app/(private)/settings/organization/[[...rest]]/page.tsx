import { OrganizationProfile } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrganizationPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">組織・招待</h1>
        </div>

        {/* Clerk Organization Profile Component - デフォルトUIを使用 */}
        <OrganizationProfile routing="hash" />
      </div>
    </div>
  );
}
