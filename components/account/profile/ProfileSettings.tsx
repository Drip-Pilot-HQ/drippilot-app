"use client";

import { useState } from "react";
import { User, Shield } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { useAuthStore } from "@/store/client/useAuthStore";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "@/store/server/auth.queries";

export function ProfileSettings() {
  const user = useAuthStore((s) => s.user);
  const currentName =
    user?.user_metadata?.name ?? user?.user_metadata?.full_name ?? "";
  const email = user?.email ?? "—";

  const [nameValue, setNameValue] = useState(currentName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateProfile = useUpdateProfileMutation();
  const changePassword = useChangePasswordMutation();

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameValue.trim()) return;
    updateProfile.mutate({ name: nameValue.trim() });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (newPassword.length < 8) {
      setValidationError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <div className="w-full space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center md:text-left">
        <h1 className="text-3xl lg:text-4xl font-heading font-black text-slate-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-slate-500 font-semibold text-md lg:text-lg">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Personal Info
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 text-sm select-all">
                  {email}
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={updateProfile.isPending || !nameValue.trim()}
              className="rounded-xl"
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900">
              Security
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900 text-sm"
                />
              </div>
            </div>

            {validationError && (
              <p className="text-sm text-red-500 font-semibold ml-1">
                {validationError}
              </p>
            )}

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={changePassword.isPending}
              className="rounded-xl"
            >
              {changePassword.isPending ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
