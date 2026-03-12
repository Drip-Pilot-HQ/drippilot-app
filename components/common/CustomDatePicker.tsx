"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isBefore,
  startOfDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disablePastDates?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disablePastDates = false,
}: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    date || new Date(),
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      setDate(newDate);
      if (!isSameMonth(currentMonth, newDate)) {
        setCurrentMonth(newDate);
      }
    } else {
      setDate(undefined);
    }
  }, [value, currentMonth]);

  const handleSelect = (day: Date) => {
    setDate(day);
    // Add timezone offset to prevent date shifting backwards over midnight
    const offsetDate = new Date(
      day.getTime() - day.getTimezoneOffset() * 60000,
    );
    onChange(offsetDate.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex h-[58px] items-center gap-3 rounded-2xl border bg-slate-50 px-5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer",
            isOpen
              ? "border-primary shadow-sm"
              : "border-slate-200 hover:bg-slate-100",
            !date && "text-slate-500",
          )}
        >
          <CalendarIcon className="h-5 w-5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-900 flex-1 text-left block truncate">
            {date ? format(date, "PPP") : placeholder}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 font-sans"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="font-bold text-slate-900 text-sm tracking-tight">
                {format(currentMonth, "MMMM yyyy")}
              </div>

              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                <div
                  key={dayName}
                  className="text-[10px] font-black uppercase text-slate-400 w-10 pb-2"
                >
                  {dayName}
                </div>
              ))}

              {days.map((day) => {
                const isSelected = date && isSameDay(day, date);
                const isTodayDate = isToday(day);
                const isOutsideMonth = !isSameMonth(day, currentMonth);
                const isPastDate =
                  disablePastDates && isBefore(day, startOfDay(new Date()));

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isPastDate}
                    onClick={() => handleSelect(day)}
                    className={cn(
                      "h-10 w-10 inline-flex items-center justify-center rounded-[14px] text-sm font-semibold transition-colors focus:outline-none",
                      isSelected
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "hover:bg-slate-100",
                      !isSelected && isTodayDate && "bg-slate-50 text-primary",
                      isPastDate &&
                        "opacity-30 cursor-not-allowed hover:bg-transparent text-slate-400",
                      isOutsideMonth && !isSelected && !isPastDate
                        ? "text-slate-300 font-medium"
                        : isSelected
                          ? ""
                          : "text-slate-700",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
