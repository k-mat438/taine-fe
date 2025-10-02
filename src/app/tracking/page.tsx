"use client";

import { Footprints, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TrackingPage() {
  const trackingData = [
    { id: 1, location: "渋谷駅", time: "09:30", date: "2024-01-15", type: "駅" },
    { id: 2, location: "新宿駅", time: "10:15", date: "2024-01-15", type: "駅" },
    { id: 3, location: "東京駅", time: "11:00", date: "2024-01-15", type: "駅" },
    { id: 4, location: "銀座", time: "14:30", date: "2024-01-14", type: "商業施設" },
    { id: 5, location: "表参道", time: "16:45", date: "2024-01-14", type: "商業施設" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Footprints className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl font-bold text-stone-800">足跡</h1>
        </div>
        
        <div className="space-y-4">
          {trackingData.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-stone-600" />
                    </div>
                    {index < trackingData.length - 1 && (
                      <div className="w-px h-6 bg-stone-200 mx-auto mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-stone-800">{item.location}</h3>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-stone-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">5</div>
                <div className="text-sm text-stone-600">訪問場所</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-800">2</div>
                <div className="text-sm text-stone-600">日数</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
