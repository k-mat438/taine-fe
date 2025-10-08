import { MobileNavbar } from '@/components/mobile-navbar';
import { UserButton } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pb-16 min-h-screen">
        {children}
      <UserButton />
      </main>
      <MobileNavbar />
    </>
  );
}