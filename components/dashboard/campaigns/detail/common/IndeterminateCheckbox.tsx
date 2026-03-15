"use client";

import { useRef, useEffect } from "react";

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  className?: string; // Add className for styling flexibility
}

export function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  onClick,
  className = "rounded w-4 h-4 accent-primary cursor-pointer shrink-0",
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={onClick}
      className={className}
    />
  );
}
