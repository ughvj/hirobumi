import * as React from "react";
import { Search, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchPopoverProps {
  events: Array<{
    id: number;
    year: number;
    title: string;
    description: string;
  }>;
  onEventSelect: (year: number) => void;
}

export function SearchPopover({ events, onEventSelect }: SearchPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedEvent, setSelectedEvent] = React.useState<string>("");

  // 検索結果のフィルタリング
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  // イベント選択時の処理
  const handleEventSelect = React.useCallback(
    (event: { year: number; title: string }) => {
      setSelectedEvent(event.title);
      onEventSelect(event.year);
      setOpen(false);
    },
    [onEventSelect]
  );

  // 検索ボタンクリック時の処理
  const handleSearch = React.useCallback(() => {
    if (selectedEvent) {
      const event = events.find((e) => e.title === selectedEvent);
      if (event) {
        onEventSelect(event.year);
      }
    }
  }, [selectedEvent, events, onEventSelect]);

  // キーボードイベントの処理
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // IMEの変換確定時は処理をスキップ
      if (e.nativeEvent.isComposing || e.key === "Process") {
        return;
      }

      if (e.key === "Enter" && filteredEvents.length > 0) {
        handleEventSelect(filteredEvents[0]);
      }
    },
    [filteredEvents, handleEventSelect]
  );

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-64 justify-between"
          >
            {selectedEvent || "イベントを検索..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="end">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="イベントを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-2">
                  イベントが見つかりません
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredEvents.map((event) => (
                    <Button
                      key={event.id}
                      variant="ghost"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => handleEventSelect(event)}
                    >
                      {event.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        className="hover:bg-blue-100"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default SearchPopover;
