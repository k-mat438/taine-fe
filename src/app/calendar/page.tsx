"use client";

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = [];
  
  // 空の日付セルを追加
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // 月の日付を追加
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl font-bold text-stone-800">カレンダー</h1>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-lg">
                {currentYear}年 {monthNames[currentMonth]}
              </CardTitle>
              <Button variant="ghost" size="icon">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-stone-600 py-2">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`text-center py-2 text-sm rounded-lg transition-colors ${
                    day === currentDate.getDate()
                      ? 'bg-stone-800 text-white'
                      : day
                      ? 'text-stone-800 hover:bg-stone-100 cursor-pointer'
                      : 'text-stone-300'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
