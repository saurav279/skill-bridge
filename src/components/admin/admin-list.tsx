"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowUpDown, ChevronLeft, ChevronRight, FilterX, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AdminUnauthorizedError } from "@/services/admin-api";
import type { AdminListQuery, AdminListResponse } from "@/types/admin";
import { packages } from "@/data/packages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminListDownload } from "./admin-list-download";

export type AdminColumn<T> = {
  id: string;
  header: string;
  className?: string;
  stopRowClick?: boolean;
  csvValue?: (row: T) => string;
  render: (row: T) => ReactNode;
};

type FilterOptionProps = "name" | "email" | "packageName" | "download" | "status";

type StatusOption = {
  value: string;
  label: string;
};

type AdminListProps<T extends { id: string }> = {
  columns: AdminColumn<T>[];
  rowHref?: (row: T) => string;
  onRowSelect?: (row: T) => void;
  selectedId?: string | null;
  toolbar?: ReactNode;
  refreshKey?: number;
  enhanceRow?: (row: T) => T;
  fetcher: (query: AdminListQuery) => Promise<AdminListResponse<T>>;
  emptyLabel: string;
  options: FilterOptionProps[];
  statusOptions?: StatusOption[];
  extraQuery?: Pick<AdminListQuery, "leadId" | "userId" | "planId">;
  downloadFilename?: string;
};

export function AdminList<T extends { id: string }>({
  columns,
  rowHref,
  onRowSelect,
  selectedId,
  toolbar,
  refreshKey = 0,
  enhanceRow,
  fetcher,
  emptyLabel,
  options,
  statusOptions = [],
  extraQuery,
  downloadFilename = "admin-list.csv",
}: AdminListProps<T>) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [packageName, setPackageName] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [result, setResult] = useState<AdminListResponse<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedName(name.trim());
      setDebouncedEmail(email.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [name, email]);

  const dateRangeInvalid = Boolean(fromDate && toDate && fromDate > toDate);
  const filterByName = options.includes("name");
  const filterByEmail = options.includes("email");
  const filterByPackage = options.includes("packageName");
  const filterByStatus = options.includes("status");

  useEffect(() => {
    let cancelled = false;
    const query: AdminListQuery = {
      page,
      limit,
      order,
    };
    if (filterByName) {
      query.name = debouncedName || undefined;
    }
    if (filterByEmail) {
      query.email = debouncedEmail || undefined;
    }
    if (filterByPackage && packageName !== "All packages") {
      query.packageName = packageName || undefined;
    }
    if (filterByStatus) {
      query.status = status || undefined;
    }
    if (fromDate) query.from = fromDate;
    if (toDate) query.to = toDate;
    if (extraQuery?.leadId) query.leadId = extraQuery.leadId;
    if (extraQuery?.userId) query.userId = extraQuery.userId;
    if (extraQuery?.planId) query.planId = extraQuery.planId;

    async function load() {
      setLoading(true);
      setError(null);

      if (dateRangeInvalid) {
        setResult(null);
        setError("From date must be on or before To date.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetcher(query);
        if (!cancelled) setResult(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AdminUnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setResult(null);
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    debouncedName,
    debouncedEmail,
    page,
    limit,
    order,
    fetcher,
    router,
    packageName,
    status,
    fromDate,
    toDate,
    dateRangeInvalid,
    refreshKey,
    filterByName,
    filterByEmail,
    filterByPackage,
    filterByStatus,
    extraQuery?.leadId,
    extraQuery?.userId,
    extraQuery?.planId,
  ]);

  const total = result?.total ?? 0;
  const totalPages = Math.max(1, result?.totalPages ?? 1);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const allPackageNames = [...packages.map((pkg) => pkg.name), "All packages"];
  const hasFilters = Boolean(
    name.trim() || email.trim() || packageName || status || fromDate || toDate
  );

  function clearFilters() {
    setName("");
    setEmail("");
    setDebouncedName("");
    setDebouncedEmail("");
    setPackageName("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-end">
        <div className="flex  flex-col md:flex-row justify-between w-full">
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {options.includes("name") && (
              <div className="space-y-1.5">
                <Label htmlFor="admin-name" className="text-xs text-muted-foreground">
                  Name
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search name"
                    className="h-9 rounded-xl pl-8"
                  />
                </div>
              </div>
            )}
            {options.includes("email") && (
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Search email"
                  className="h-9 rounded-xl"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="admin-from" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input
                id="admin-from"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-to" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input
                id="admin-to"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-xl"
              />
            </div>
            {options.includes("packageName") && (
              <div className="space-y-1.5">
                <Label htmlFor="admin-package" className="text-xs text-muted-foreground">
                  Packages
                </Label>
                <Select
                  id="admin-package"
                  value={packageName}
                  onValueChange={(value) => {
                    setPackageName(value || "");
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPackageNames.map((pkgName) => (
                      <SelectItem key={pkgName} value={pkgName} className="w-full">
                        {pkgName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {options.includes("status") && statusOptions.length > 0 && (
              <div className="space-y-1.5">
                <Label htmlFor="admin-status" className="text-xs text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={status || "__all__"}
                  onValueChange={(value) => {
                    setStatus(value === "__all__" ? "" : value || "");
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="admin-status" className="w-full">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All statuses</SelectItem>
                    {statusOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toolbar}
          {hasFilters ? (
            <Button
              type="button"
              // variant="outline"
              className="h-9 rounded-xl"
              onClick={clearFilters}
            >
              <FilterX className="size-3.5" />
              Remove filters
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl"
            onClick={() => setOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
          >
            <ArrowUpDown className="size-3.5" />
            {order === "desc" ? "Newest" : "Oldest"}
          </Button>
          <select
            aria-label="Rows per page"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-9 rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={100}>200</option>
            <option value={100}>300</option>
          </select>

          {options.includes("download") && (
            <AdminListDownload
              filename={downloadFilename}
              columns={columns}
              rows={(result?.data ?? []).map((row) =>
                enhanceRow ? enhanceRow(row) : row
              )}
            />
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn("px-4 py-3 font-medium", column.className)}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-sm text-destructive"
                  >
                    {error}
                  </td>
                </tr>
              ) : !result?.data.length ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-sm text-muted-foreground"
                  >
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                result.data.map((rawRow) => {
                  const row = enhanceRow ? enhanceRow(rawRow) : rawRow;
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border last:border-0",
                        rowHref || onRowSelect
                          ? "cursor-pointer hover:bg-muted/40"
                          : null,
                        selectedId === row.id && "bg-muted/50"
                      )}
                      onClick={() => {
                        if (onRowSelect) {
                          onRowSelect(row);
                          return;
                        }
                        if (rowHref) router.push(rowHref(row));
                      }}
                    >
                      {columns.map((column, index) => (
                        <td
                          key={column.id}
                          className={cn("px-4 py-3", column.className)}
                          onClick={
                            column.stopRowClick
                              ? (event) => event.stopPropagation()
                              : undefined
                          }
                          onPointerDown={
                            column.stopRowClick
                              ? (event) => event.stopPropagation()
                              : undefined
                          }
                        >
                          {index === 0 && rowHref ? (
                            <Link
                              href={rowHref(row)}
                              className="font-medium text-foreground underline-offset-4 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {column.render(row)}
                            </Link>
                          ) : index === 0 ? (
                            <span className="font-medium text-foreground">
                              {column.render(row)}
                            </span>
                          ) : (
                            column.render(row)
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {total === 0
              ? "No results"
              : `Showing ${from}–${to} of ${total}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <span className="min-w-16 text-center font-mono text-xs">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-3.5" />
      {label}
    </Link>
  );
}

export function AdminFact({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[160px_1fr] sm:items-start sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{children}</dd>
    </div>
  );
}

export function AdminPanel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full truncate rounded-full px-2 py-0.5 font-mono text-[11px] font-medium",
        tone ?? "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </span>
  );
}

export function ScorePill({ score }: { score: number }) {
  const tone =
    score >= 75
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : score >= 50
        ? "bg-amber-500/10 text-amber-800 dark:text-amber-400"
        : "bg-red-500/10 text-red-700 dark:text-red-400";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 font-mono text-xs font-medium",
        tone
      )}
    >
      {Math.round(score)}
    </span>
  );
}

export function AdminStatus({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-16 text-center text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  return <>{children}</>;
}

export function ExternalOrDash({
  href,
  children,
}: {
  href: string | null | undefined;
  children: ReactNode;
}) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}
