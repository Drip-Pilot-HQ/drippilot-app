import { Key, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { ApiKey } from "@/types/account";
import { useRevokeApiKeyMutation } from "@/store/server/account.queries";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/components/branding/ConfirmProvider";

interface ApiKeyCardProps {
  apiKey: ApiKey;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

export function ApiKeyCard({ apiKey }: ApiKeyCardProps) {
  const revokeMutation = useRevokeApiKeyMutation();
  const confirm = useConfirm();

  const handleRevoke = async () => {
    const isConfirmed = await confirm({
      title: "Revoke API Key",
      description: `Are you sure you want to revoke "${apiKey.name}"? Any applications using this key will lose access immediately.`,
      confirmLabel: "Revoke Key",
      variant: "danger",
    });

    if (isConfirmed) {
      await revokeMutation.mutateAsync(apiKey.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
          <Key className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900 flex flex-wrap items-center gap-2">
            {apiKey.name}
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-mono font-medium">
              {apiKey.keyPrefix}...
            </span>
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Created:{" "}
              <span className="text-slate-900">
                {formatDate(apiKey.createdAt)}
              </span>
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              Expires:{" "}
              <span
                className={cn(
                  apiKey.expiresAt ? "text-slate-900" : "text-slate-400",
                )}
              >
                {formatDate(apiKey.expiresAt)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="w-10 h-10 p-0 rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          variant="outline"
          onClick={handleRevoke}
          isLoading={revokeMutation.isPending}
          title="Revoke Key"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
