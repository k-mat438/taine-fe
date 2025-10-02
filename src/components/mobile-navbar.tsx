"use client";

import { Pencil, FileText, Calendar, Footprints, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { icon: Pencil, href: '/edit', label: '編集' },
  { icon: FileText, href: '/notes', label: 'ノート' },
  { icon: Calendar, href: '/calendar', label: 'カレンダー' },
  { icon: Footprints, href: '/tracking', label: '足跡' },
  { icon: Settings, href: '/settings', label: '設定' },
];

export function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-stone-200 border-t border-stone-300 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                isActive ? 'text-stone-800' : 'text-stone-600 hover:text-stone-700'
              }`}
              aria-label={item.label}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white rounded-xl mx-1 shadow-sm animate-in fade-in zoom-in-95 duration-200" />
              )}
              <Icon
                className={`relative w-6 h-6 transition-all duration-300 ${
                  isActive ? 'scale-110' : 'hover:scale-105'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
