import { toast as sonnerToast } from "sonner";

export type ToastVariant = "info" | "error" | "success";

export type ShowToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

/**
 * Show a themed toast anywhere in the app.
 *
 * @example
 * showToast({ title: "Saved", description: "Your changes are live.", variant: "success" })
 * toast.error("Upload failed", "Please try again.")
 * toast.info("Tip", "You can edit this later.")
 */
export function showToast({
  title,
  description,
  variant = "info",
  duration,
}: ShowToastOptions) {
  const options = { description, duration };

  switch (variant) {
    case "error":
      return sonnerToast.error(title, options);
    case "success":
      return sonnerToast.success(title, options);
    case "info":
    default:
      return sonnerToast.info(title, options);
  }
}

export const toast = {
  info: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "info", duration }),
  error: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "error", duration }),
  success: (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "success", duration }),
};
