import { useApiKeysQuery } from "@/store/server/account.queries";
import { ApiKeyCard } from "./ApiKeyCard";

export function ApiKeyList() {
  const { data: apiKeys, isLoading, isError } = useApiKeysQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 text-red-600 text-center border border-red-100">
        Failed to load API keys.
      </div>
    );
  }

  if (!apiKeys || apiKeys.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-slate-50 text-slate-500 text-center border border-slate-100 italic">
        No API keys found. Create one to access the API programmatically.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((key) => (
        <ApiKeyCard key={key.id} apiKey={key} />
      ))}
    </div>
  );
}
