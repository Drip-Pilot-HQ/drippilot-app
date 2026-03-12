import { AlertTriangle } from "lucide-react";

export function EnrollmentWarningBanner() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <p className="text-sm text-amber-800 font-medium leading-relaxed">
        <span className="font-black">Heads up:</span> Leads already enrolled in
        this campaign will continue following their current sequence steps
        timeline. Only new enrollments will follow the updated workflow
        timeline.
      </p>
    </div>
  );
}
