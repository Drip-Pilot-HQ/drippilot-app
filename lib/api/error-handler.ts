import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}

export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    const message =
      data?.message || error.message || "An unexpected error occurred";

    // Handle multiple messages (e.g. from validation filters)
    if (Array.isArray(message)) {
      message.forEach((msg) => {
        showErrorToast(msg);
      });
    } else {
      showErrorToast(message);
    }
  } else if (error instanceof Error) {
    showErrorToast(error.message);
  } else {
    showErrorToast("An unknown error occurred");
  }
};

const showErrorToast = (message: string) => {
  toast.error("Action Failed", {
    description: message,
    className: "rounded-2xl border-rose-100 bg-white shadow-xl",
    descriptionClassName: "font-semibold text-rose-500 text-xs",
    duration: 5000,
  });
};
