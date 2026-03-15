"use client";

import { X, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variants = {
    danger: "bg-red-500 hover:bg-red-600 shadow-red-200",
    primary: "bg-primary hover:bg-primary/90 shadow-primary/20",
    warning: "bg-orange-500 hover:bg-orange-600 shadow-orange-200",
  };

  const iconVariants = {
    danger: "bg-red-50 text-red-500",
    primary: "bg-primary/10 text-primary",
    warning: "bg-orange-50 text-orange-500",
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                iconVariants[variant],
              )}
            >
              <AlertCircle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl h-12 text-sm font-bold border-2"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "flex-1 rounded-xl h-12 text-sm font-bold text-white shadow-lg transition-all",
                variants[variant],
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
