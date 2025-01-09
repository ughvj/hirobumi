import * as React from "react";
import { Search, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchComboboxProps {
  events: Array<{
    id: number;
    year: number;
    title: string;
    description: string;
  }>;
  onEventSelect: (year: number) => void;
}

export function SearchCombobox({ events, onEventSelect }: SearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      setValue(currentValue);
      setOpen(false);
      const selectedEvent = events.find(
        (event) => event.title === currentValue
      );
      if (selectedEvent) {
        onEventSelect(selectedEvent.year);
      }
    },
    [events, onEventSelect]
  );

  const handleSearch = React.useCallback(() => {
    if (value) {
      const selectedEvent = events.find((event) => event.title === value);
      if (selectedEvent) {
        onEventSelect(selectedEvent.year);
      }
    }
  }, [value, events, onEventSelect]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const filteredEvents = React.useMemo(
    () =>
      events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [events, searchTerm]
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
            {value || "出来事を検索..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0">
          <Command>
            <CommandList>
              <CommandInput
                placeholder="出来事を検索..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                onKeyDown={handleKeyDown}
              />
              <CommandEmpty>出来事が見つかりません</CommandEmpty>
              <CommandGroup>
                {filteredEvents.map((event) => (
                  <CommandItem
                    key={event.id}
                    value={event.title}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === event.title ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {event.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
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

export default SearchCombobox;
