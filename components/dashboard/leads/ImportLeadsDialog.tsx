"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, FileText, Info } from "lucide-react";
import { toast } from "sonner";
import { useImportLeadsMutation } from "@/store/server/lead.queries";
import { Button } from "@/components/branding/Button";
import { cn } from "@/lib/utils";
import axios from "axios";

interface ImportLeadsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportLeadsDialog({ isOpen, onClose }: ImportLeadsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportLeadsMutation();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();
      if (ext && ["csv", "xlsx", "xls", "xlsm"].includes(ext)) {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a CSV or Excel file");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }
    if (!consentAgreed) {
      toast.error(
        "You must agree to the communication consent to import leads",
      );
      return;
    }

    try {
      const result = await importMutation.mutateAsync(file);
      toast.success(`Successfully imported ${result.count || "all"} leads!`);
      onClose();
      setFile(null);
      setConsentAgreed(false);
    } catch (error: unknown) {
      let errorMessage = "Failed to import leads";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Import Leads
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Upload CSV or Excel file to batch import
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
            {/* File Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer",
                file
                  ? "border-primary/40 bg-primary/5"
                  : "border-slate-200 hover:border-primary/40 hover:bg-slate-50",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls,.xlsm"
                onChange={handleFileChange}
              />

              {file ? (
                <div className="flex flex-col items-center animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 shadow-lg shadow-primary/10">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-black text-slate-900 text-center truncate max-w-[240px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-600">
                      Drop your file here or{" "}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                      CSV, XLSX, XLS (Max 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Hint Box */}
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-blue-700 leading-normal">
                  Make sure your file includes columns for Email, Phone, and
                  Name. Any tags included will be automatically associated.
                </p>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="space-y-3 p-5 border border-orange-100 rounded-3xl bg-orange-50/30">
              <div className="flex items-start space-x-3">
                <div className="relative flex items-center">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="w-5 h-5 rounded-md border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer mt-0.5"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="consent"
                    className="text-sm font-black text-slate-800 leading-5 cursor-pointer flex items-center gap-2"
                  >
                    Communication Consent Confirmation
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal">
                    I confirm that the leads have{" "}
                    <strong>explicitly consented</strong> to receive messages
                    related to our services. I understand that Drip Pilot is not
                    liable for any compliance issues arising from leads added
                    without proper consent. All communications must comply with
                    applicable laws and regulations.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl h-14"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || !consentAgreed || importMutation.isPending}
                className="flex-2 rounded-2xl h-14"
              >
                {importMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">Import Leads</div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
