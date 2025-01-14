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

import EraConvert from "../utils/util";
import SearchPopover from "./combobox";

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
  const scrollToYear = useCallback(
    (year: number) => {
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
    },
    [timelineData]
  );

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
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          {/* 左側：メニューとロゴ */}
          <div className="flex items-center space-x-0">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-fit max-w-[70vw] min-w-[200px] border-r"
              >
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold">
                    メニュー
                  </SheetTitle>
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
          </div>

          {/* 右側：検索コンボボックス */}
          <div className="flex-shrink-0">
            <SearchPopover events={timelineData} onEventSelect={scrollToYear} />
          </div>
        </div>
      </header>

      {/* 固定年号表示とコントロール */}
      <div className="fixed top-16 left-0 right-0 h-12 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-3 items-center">
          {/* 左側のボタン */}
          <div className="flex items-center gap-2 justify-start">
            <button
              onClick={() => changeYear(-50)}
              className="px-2 py-1 text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 rounded transition-colors"
            >
              -50
            </button>
            <button
              onClick={() => changeYear(-10)}
              className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              -10
            </button>
          </div>

          {/* 中央の年号表示 */}
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-600 text-center whitespace-nowrap">
            {currentYear}年 ({EraConvert(currentYear)})
          </div>

          {/* 右側のボタン */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => changeYear(10)}
              className="px-2 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              +10
            </button>
            <button
              onClick={() => changeYear(50)}
              className="px-2 py-1 text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 rounded transition-colors"
            >
              +50
            </button>
          </div>
        </div>
      </div>

      {/* タイムラインコンテンツ */}
      <div className="pt-28 pb-12" ref={timelineRef}>
        <div className="max-w-lg mx-auto px-4">
          {timelineData.map((event) => (
            <div
              key={event.id}
              className={"timeline-item relative mb-8"}
              data-year={event.year}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer touch-manipulation"
                onClick={() => handleClick(event)}
                onTouchStart={handleTouchStart}
                onTouchEnd={() => handleTouchEnd(event)}
                onTouchCancel={() => (pressStartTime.current = null)}
              >
                <h3 className="text-xl font-bold text-blue-600">
                  {event.year}年{event.month}月
                </h3>
                <h4 className="text-lg font-semibold mt-2">{event.title}</h4>
              </div>
            </div>
          ))}
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
