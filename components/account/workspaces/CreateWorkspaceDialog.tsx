import { useState } from "react";
import { Plus, X, Briefcase } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { useCreateWorkspaceMutation } from "@/store/server/account.queries";

export function CreateWorkspaceDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const createMutation = useCreateWorkspaceMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createMutation.mutateAsync({ name });
      setName("");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to create workspace", error);
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
        <span>Create Workspace</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-heading font-black text-slate-900">
            Create New Workspace
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                Workspace Name
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <input
                  autoFocus
                  required
                  placeholder="e.g. My Awesome Team"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-semibold"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 italic">
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed text-center">
                You will be the owner of this workspace and can invite team
                members later.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-4 rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-4 rounded-xl"
                isLoading={createMutation.isPending}
              >
                Create Now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
