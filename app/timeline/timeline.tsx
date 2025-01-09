// app/components/Timeline.tsx
"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
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

import timelineData from "./events.json";

const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [currentYear, setCurrentYear] = useState(timelineData[0].year);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pressStartTime = useRef<number | null>(null);

  // スクロール処理
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const elements =
        timelineRef.current.getElementsByClassName("timeline-item");
      const headerHeight = 120;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const rect = element.getBoundingClientRect();

        if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
          const year = Number(element.getAttribute("data-year"));
          if (!isNaN(year)) {
            setCurrentYear(year);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // タッチイベントハンドラー
  const handleTouchStart = useCallback(() => {
    pressStartTime.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback((event: TimelineEvent) => {
    if (pressStartTime.current) {
      const pressDuration = Date.now() - pressStartTime.current;
      // 500ms以上のタッチでモーダルを表示
      if (pressDuration >= 500) {
        setSelectedEvent(event);
      }
      pressStartTime.current = null;
    }
  }, []);

  // クリック/タップハンドラー
  const handleClick = useCallback((event: TimelineEvent) => {
    // モバイルでないときはクリックでモーダルを表示
    if (pressStartTime.current === null) {
      setSelectedEvent(event);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 固定ヘッダー */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Menu size={24} />
          </button>
          <div className="ml-4 text-xl font-bold">Timeline Logo</div>
        </div>
      </header>

      {/* 固定年号表示 */}
      <div className="fixed top-16 left-0 right-0 h-12 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40 flex items-center justify-center">
        <div className="text-2xl font-bold text-blue-600">{currentYear}年</div>
      </div>

      {/* タイムラインコンテンツ */}
      <div className="pt-28 pb-12" ref={timelineRef}>
        <div className="max-w-lg mx-auto px-4">
          <div className="relative pl-8">
            {/* 左端の垂直ライン */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-blue-200" />

            {timelineData.map((event, index) => (
              <div
                key={event.year}
                className="timeline-item relative mb-8"
                data-year={event.year}
              >
                {/* ドットとイベントをつなぐライン */}
                <div className="absolute left-0 top-6 w-8 h-px bg-blue-200" />

                {/* タイムラインドット */}
                <div className="absolute left-[-4px] top-[22px] w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-200" />

                {/* イベントカード */}
                <div
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer touch-manipulation"
                  onClick={() => handleClick(event)}
                  onTouchStart={() => handleTouchStart()}
                  onTouchEnd={() => handleTouchEnd(event)}
                  onTouchCancel={() => (pressStartTime.current = null)}
                >
                  <h3 className="text-xl font-bold text-blue-600">
                    {event.year}
                  </h3>
                  <h4 className="text-lg font-semibold mt-2">{event.title}</h4>
                </div>

                {/* 最後のアイテム以外に区切り線を表示 */}
                {index !== timelineData.length - 1 && (
                  <div className="absolute left-4 top-12 bottom-[-2rem] w-px bg-blue-200 opacity-50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* モーダルダイアログ */}
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
    </div>
  );
};

export default Timeline;
