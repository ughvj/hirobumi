// app/components/Timeline.tsx
"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: 2020,
    title: "デジタル化の加速",
    description: "コロナ禍によりリモートワークが一般化",
  },
  {
    year: 2021,
    title: "ワクチン接種開始",
    description: "世界的なワクチン接種キャンペーンの展開",
  },
  {
    year: 2022,
    title: "Web3の台頭",
    description: "ブロックチェーン技術の実用化が進む",
  },
  {
    year: 2023,
    title: "AI革命",
    description: "生成AIの普及により産業構造が変化",
  },
  {
    year: 2024,
    title: "新時代の幕開け",
    description: "テクノロジーと人間の共生が進む",
  },
];

const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  // デバイス検出
  React.useEffect(() => {
    setIsMobile("ontouchstart" in window);
  }, []);

  // タッチ開始時の処理
  const handleTouchStart = useCallback((event: TimelineEvent) => {
    const timer = setTimeout(() => {
      setSelectedEvent(event);
    }, 500); // 500ms の長押しで発火
    setLongPressTimer(timer);
  }, []);

  // タッチ終了時の処理
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  // クリック/タップハンドラー
  const handleInteraction = useCallback(
    (event: TimelineEvent) => {
      if (!isMobile) {
        setSelectedEvent(event);
      }
    },
    [isMobile]
  );

  return (
    <>
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          現代史タイムライン
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200" />

          {timelineData.map((event, index) => (
            <div
              key={event.year}
              className={`flex items-center mb-12 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                }`}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer touch-manipulation"
                  onClick={() => handleInteraction(event)}
                  onTouchStart={() => handleTouchStart(event)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                >
                  <h3 className="text-xl font-bold text-blue-600">
                    {event.year}
                  </h3>
                  <h4 className="text-lg font-semibold mt-2">{event.title}</h4>
                </div>
              </div>

              <div className="w-2/12 flex justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-200 transform translate-y-1/2" />
              </div>

              <div className="w-5/12" />
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={selectedEvent !== null}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedEvent.year}年: {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6">
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Timeline;
