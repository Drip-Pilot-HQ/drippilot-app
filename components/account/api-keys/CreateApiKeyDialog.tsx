import { useState } from "react";
import { Plus, X, Shield, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { CustomDatePicker } from "@/components/common/CustomDatePicker";
import { useCreateApiKeyMutation } from "@/store/server/account.queries";
import { ApiKeyCreatedResponse } from "@/types/account";

export function CreateApiKeyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [createdKey, setCreatedKey] = useState<ApiKeyCreatedResponse | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const createMutation = useCreateApiKeyMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const result = await createMutation.mutateAsync({
        name,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      });
      setCreatedKey(result);
      setName("");
      setExpiresAt("");
    } catch (error) {
      console.error("Failed to create API key", error);
    }
  };

  const close = () => {
    setIsOpen(false);
    setCreatedKey(null);
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey.rawKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        size="md"
        className="gap-2 shrink-0 mx-auto md:mx-0 rounded-xl"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="w-5 h-5" />
        <span>New Token</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-heading font-black text-slate-900">
            {createdKey ? "Token Created" : "Create New Token"}
          </h2>
          <button
            onClick={close}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {createdKey ? (
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-orange-900 leading-relaxed uppercase tracking-wider">
                  Store this key securely! It will not be shown again.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Your API Key
                </label>
                <div className="relative group">
                  <input
                    readOnly
                    onClick={handleCopy}
                    value={createdKey.rawKey}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-mono text-sm text-slate-900 focus:outline-none pr-12 cursor-pointer"
                  />
                  <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white border border-slate-200 rounded-xl transition-all shadow-sm"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                    )}
                  </button>
                </div>
              </div>

              <Button onClick={close} className="w-full py-4">
                I&apos;ve stored the key
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                  Token Name
                </label>
                <input
                  autoFocus
                  required
                  placeholder="e.g. Production API"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                  Expires At (Optional)
                </label>
                <CustomDatePicker
                  value={expiresAt}
                  onChange={setExpiresAt}
                  placeholder="Select expiration date"
                  disablePastDates
                />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 flex items-start gap-4 border border-slate-100">
                <Shield className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                  This token will allow full access to your account via the API.
                  Store it carefully, as you won&apos;t be able to see it again.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-4"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-4"
                  isLoading={createMutation.isPending}
                >
                  Create Token
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
