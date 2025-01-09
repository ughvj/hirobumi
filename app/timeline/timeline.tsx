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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import timelineData from "./events.json";

import Image from "next/image";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [currentYear, setCurrentYear] = useState(timelineData[0].year);
  const timelineRef = useRef<HTMLDivElement>(null);
  const pressStartTime = useRef<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 指定した年のイベントまでスクロール
  const scrollToYear = useCallback((year: number) => {
    if (!timelineRef.current) return;

    const elements =
      timelineRef.current.getElementsByClassName("timeline-item");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      const elementYear = Number(element.getAttribute("data-year"));

      if (elementYear >= year) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        break;
      }
    }
  }, []);

  // 年号の増減処理
  const changeYear = useCallback(
    (amount: number) => {
      const nearestEvent = timelineData.reduce((prev, curr) => {
        const prevDiff = Math.abs(prev.year - (currentYear + amount));
        const currDiff = Math.abs(curr.year - (currentYear + amount));
        return prevDiff < currDiff ? prev : curr;
      });
      scrollToYear(nearestEvent.year);
    },
    [currentYear, scrollToYear]
  );

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
      if (pressDuration >= 500) {
        setSelectedEvent(event);
      }
      pressStartTime.current = null;
    }
  }, []);

  const handleClick = useCallback((event: TimelineEvent) => {
    if (pressStartTime.current === null) {
      setSelectedEvent(event);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 固定ヘッダー */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[40vw] border-r">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">メニュー</SheetTitle>
              </SheetHeader>
              <nav className="space-y-4 mt-6">
                <a
                  href="#"
                  className="block px-2 py-2 text-lg hover:bg-gray-100 rounded"
                >
                  ホーム
                </a>
                <a
                  href="#"
                  className="block px-2 py-2 text-lg hover:bg-gray-100 rounded"
                >
                  年表について
                </a>
                <a
                  href="#"
                  className="block px-2 py-2 text-lg hover:bg-gray-100 rounded"
                >
                  カテゴリー
                </a>
                <a
                  href="#"
                  className="block px-2 py-2 text-lg hover:bg-gray-100 rounded"
                >
                  設定
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <Image
            src="/logo.png" // 画像のURL (publicディレクトリにある場合は相対パス)
            alt="説明テキスト"
            width={100} // 表示する幅
            height={100} // 表示する高さ
          />
        </div>
      </header>

      {/* 固定年号表示とコントロール */}
      <div className="fixed top-16 left-0 right-0 h-12 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changeYear(-10)}
              className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              -10
            </button>
            <button
              onClick={() => changeYear(10)}
              className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              +10
            </button>
            <div className="text-2xl font-bold text-blue-600">
              {currentYear}年
            </div>
            <button
              onClick={() => changeYear(-100)}
              className="px-2 py-1 text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 rounded transition-colors"
            >
              -100
            </button>
            <button
              onClick={() => changeYear(100)}
              className="px-2 py-1 text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 rounded transition-colors"
            >
              +100
            </button>
          </div>
        </div>
      </div>

      {/* タイムラインコンテンツ */}
      <div className="pt-28 pb-12" ref={timelineRef}>
        <div className="max-w-lg mx-auto px-4">
          <div className="relative pl-8">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-blue-200" />

            {timelineData.map((event, index) => (
              <div
                key={event.year}
                className="timeline-item relative mb-8"
                data-year={event.year}
              >
                <div className="absolute left-0 top-6 w-8 h-px bg-blue-200" />
                <div className="absolute left-[-4px] top-[22px] w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-200" />

                <div
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer touch-manipulation"
                  onClick={() => handleClick(event)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={() => handleTouchEnd(event)}
                  onTouchCancel={() => (pressStartTime.current = null)}
                >
                  <h3 className="text-xl font-bold text-blue-600">
                    {event.year}年
                  </h3>
                  <h4 className="text-lg font-semibold mt-2">{event.title}</h4>
                </div>

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
