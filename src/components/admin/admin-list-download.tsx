"use client";

import { isValidElement, type ReactNode } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminColumn } from "@/components/admin/admin-list";

interface AdminListDownloadProps<T> {
  filename: string;
  columns: AdminColumn<T>[];
  rows: T[];
}

function reactNodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number" || typeof node === "bigint") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node
      .map(reactNodeToText)
      .map((part) => part.trim())
      .filter(Boolean)
      .join("\n");
  }
  if (isValidElement(node)) {
    return reactNodeToText(
      (node.props as { children?: ReactNode }).children
    );
  }
  return "";
}

function escapeCsvValue(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function AdminListDownload<T>({
  filename,
  columns,
  rows,
}: AdminListDownloadProps<T>) {
  const handleDownload = () => {
    const headers = columns.map((column) => column.header);
    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        columns
          .map((column) => escapeCsvValue(reactNodeToText(column.render(row))))
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([`\ufeff${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const downloadName = filename.toLowerCase().endsWith(".csv")
      ? filename
      : `${filename}.csv`;

    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button type="button" variant="outline" onClick={handleDownload} className="h-9 rounded-xl">
      <Download className="size-4" />
      Download
    </Button>
  );
}
