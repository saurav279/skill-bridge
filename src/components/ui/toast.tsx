"use client";

import {
  CircleCheck,
  Info,
  Loader2,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { ToastContainer, toast as toastBase, Slide } from "react-toastify";

export function Toaster() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
      limit={3}
      className="toast-container"
      toastClassName={() =>
        "flex gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-600"
      }
      progressClassName="toast-progress"
    />
  );
}

// const iconStyles = {
//   success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
//   error: "bg-red-500/15 text-red-600 dark:text-red-400",
//   info: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
//   warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
//   loading: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
// };

const iconComponents = {
  success: CircleCheck,
  error: OctagonX,
  info: Info,
  warning: TriangleAlert,
  loading: Loader2,
};

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  type?: "success" | "error" | "info" | "warning" | "loading";
}

export function showToast({
  title,
  description,
  duration = 4000,
  type = "info",
}: ToastOptions) {
  const Icon = iconComponents[type];

  const content = (
    <div className="flex gap-3">
     
      <div className="flex flex-col gap-1">
        {title && (
          <p className="font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </p>
        )}
        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  toastBase(content, {
    type: type === "loading" ? "default" : type,
    autoClose: type === "loading" ? false : duration,
    closeButton: true,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

// Convenience functions
export const toast = {
  success: (title: string, description?: string) =>
    showToast({ title, description, type: "success" }),
  error: (title: string, description?: string) =>
    showToast({ title, description, type: "error" }),
  info: (title: string, description?: string) =>
    showToast({ title, description, type: "info" }),
  warning: (title: string, description?: string) =>
    showToast({ title, description, type: "warning" }),
  loading: (title: string, description?: string) =>
    showToast({ title, description, type: "loading" }),
};