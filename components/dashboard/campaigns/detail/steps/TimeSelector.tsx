"use client";

import { CustomSelect } from "@/components/common/CustomSelect";

function buildTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [
    { value: "", label: "Any time" },
  ];

  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 15, 30, 45]) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute.toString().padStart(2, "0");
      const label = `${displayHour}:${displayMinute} ${period}`;
      const value = `${hour.toString().padStart(2, "0")}:${displayMinute}`;
      slots.push({ value, label });
    }
  }

  return slots;
}

const TIME_SLOTS = buildTimeSlots();

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeSelector({ value, onChange }: TimeSelectorProps) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={TIME_SLOTS}
      placeholder="Any time"
    />
  );
}
