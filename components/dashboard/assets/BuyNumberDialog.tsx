"use client";

import { useState } from "react";
import { X, Search, Phone, Loader2, ChevronRight, Check } from "lucide-react";
import { AvailablePhoneNumber } from "@/types/assets";
import {
  useSearchPhoneNumbersQuery,
  useBuyPhoneNumberMutation,
} from "@/store/server/assets.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/branding/Button";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface BuyNumberDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyNumberDialog({ isOpen, onClose }: BuyNumberDialogProps) {
  const [areaCode, setAreaCode] = useState("");
  const debouncedAreaCode = useDebounce(areaCode, 500);
  const [selectedNumber, setSelectedNumber] =
    useState<AvailablePhoneNumber | null>(null);

  const { data: availableNumbers, isLoading: isSearchLoading } =
    useSearchPhoneNumbersQuery(
      { areaCode: debouncedAreaCode, limit: 12 },
      debouncedAreaCode.length === 3,
    );

  const buyMutation = useBuyPhoneNumberMutation();

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleBuy = async () => {
    if (!selectedNumber) return;
    try {
      await buyMutation.mutateAsync({
        phoneNumber: selectedNumber.phoneNumber,
      });
      onClose();
    } catch (error) {
      console.error("Failed to buy phone number", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Provision Number
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Acquire a dedicated phone line
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1 group/input">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={areaCode}
                  onChange={(e) =>
                    setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  placeholder="Area Code (e.g. 415)"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={isSearchLoading || areaCode.length < 3}
                className="rounded-xl px-6 h-12 flex-none"
              >
                {isSearchLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </form>

            <div className="min-h-[300px] max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-100">
              {isSearchLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Scanning available lines...
                  </p>
                </div>
              ) : availableNumbers && availableNumbers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableNumbers.map((number: AvailablePhoneNumber) => (
                    <button
                      key={number.phoneNumber}
                      onClick={() => setSelectedNumber(number)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        selectedNumber?.phoneNumber === number.phoneNumber
                          ? "bg-primary border-primary shadow-lg shadow-primary/20"
                          : "bg-white border-slate-200 hover:border-primary/50 group",
                      )}
                    >
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-sm font-black transition-colors",
                            selectedNumber?.phoneNumber === number.phoneNumber
                              ? "text-white"
                              : "text-slate-900 group-hover:text-primary",
                          )}
                        >
                          {number.friendlyName}
                        </span>
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-tight opacity-60",
                            selectedNumber?.phoneNumber === number.phoneNumber
                              ? "text-white"
                              : "text-slate-500",
                          )}
                        >
                          {number.locality || "Unknown Locality"}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center transition-colors shadow-sm",
                          selectedNumber?.phoneNumber === number.phoneNumber
                            ? "bg-white/20 text-white"
                            : "bg-slate-50 text-slate-300",
                        )}
                      >
                        {selectedNumber?.phoneNumber === number.phoneNumber ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-4 text-slate-200">
                    <Phone className="w-8 h-8" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    {areaCode.length < 3
                      ? "Enter an area code to begin"
                      : "No results found for this area code"}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl h-12 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBuy}
                disabled={buyMutation.isPending || !selectedNumber}
                className="flex-2 rounded-xl h-12 text-sm"
              >
                {buyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add Number"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
