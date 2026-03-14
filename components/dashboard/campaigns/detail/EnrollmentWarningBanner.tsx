import { AlertTriangle } from "lucide-react";

export function EnrollmentWarningBanner() {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-100">
      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
      <p className="text-sm text-amber-700 font-medium leading-relaxed">
        <span className="font-semibold">Heads up:</span> Leads already enrolled
        in this campaign will continue following their current sequence steps
        timeline. Only new enrollments will follow the updated workflow
        timeline.
      </p>
    </div>
  );
}
