"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  StatusChip,
  type AdminColumn,
} from "@/components/admin/admin-list";
import { InstallmentActions } from "@/components/admin/installment-actions";
import {
  dash,
  formatAdminDate,
  formatAdminDay,
  formatStripeAmount,
  packageLabel,
} from "@/lib/admin-format";
import {
  INSTALLMENT_STATUSES,
  installmentStatusLabel,
  installmentStatusTone,
} from "@/lib/installments";
import {
  AdminUnauthorizedError,
  getInstallment,
  getInstallmentStatusCounts,
  listInstallments,
} from "@/services/admin-api";
import type { Installment, InstallmentStatusCounts } from "@/types/admin";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function InstallmentsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [listTick, setListTick] = useState(0);
  const [drawerTick, setDrawerTick] = useState(0);

  const selectedId = searchParams.get("installment");

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("installment", id);
      else params.delete("installment");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="space-y-4">
      <InstallmentStats refreshKey={listTick} />
      <InstallmentTable
        onRowSelect={(row) => setSelectedId(row.id)}
        selectedId={selectedId}
        refreshKey={listTick}
      />
      <InstallmentDrawer
        installmentId={selectedId}
        reloadKey={drawerTick}
        onClose={() => setSelectedId(null)}
        onChanged={() => {
          setListTick((tick) => tick + 1);
          setDrawerTick((tick) => tick + 1);
        }}
      />
    </div>
  );
}

function InstallmentTable({
  selectedId,
  onRowSelect,
  refreshKey,
}: {
  selectedId?: string | null;
  onRowSelect: (row: Installment) => void;
  refreshKey: number;
}) {
  const fetcher = useCallback(listInstallments, []);
  const columns = useMemo<AdminColumn<Installment>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        csvValue: (row) => dash(row.customerName),
        render: (row) => dash(row.customerName),
      },
      {
        id: "contact",
        header: "Contact",
        className: "font-mono text-xs",
        csvValue: (row) =>
          [dash(row.customerEmail), dash(row.customerPhone)].join(" "),
        render: (row) => (
          <div>
            <p>{dash(row.customerEmail)}</p>
            <p>{dash(row.customerPhone)}</p>
          </div>
        ),
      },
      {
        id: "package",
        header: "Package",
        csvValue: (row) => packageLabel(row.packageName),
        render: (row) => packageLabel(row.packageName),
      },
      {
        id: "sequence",
        header: "Installment",
        className: "font-mono text-xs",
        csvValue: (row) => `${row.sequence} of ${row.installmentCount}`,
        render: (row) => `${row.sequence} of ${row.installmentCount}`,
      },
      {
        id: "amount",
        header: "Amount",
        className: "font-mono text-xs",
        csvValue: (row) => formatStripeAmount(row.amount, row.currency),
        render: (row) => formatStripeAmount(row.amount, row.currency),
      },
      {
        id: "due",
        header: "Due",
        csvValue: (row) => formatAdminDay(row.dueAt),
        render: (row) => formatAdminDay(row.dueAt),
      },
      {
        id: "status",
        header: "Status",
        csvValue: (row) => installmentStatusLabel(row.status),
        render: (row) => (
          <StatusChip
            label={installmentStatusLabel(row.status)}
            tone={installmentStatusTone(row.status)}
          />
        ),
      },
      {
        id: "progress",
        header: "Paid / total",
        className: "font-mono text-xs text-muted-foreground",
        csvValue: (row) =>
          `${formatStripeAmount(row.paidAmount, row.currency)} / ${formatStripeAmount(row.totalAmount, row.currency)}`,
        render: (row) =>
          `${formatStripeAmount(row.paidAmount, row.currency)} / ${formatStripeAmount(row.totalAmount, row.currency)}`,
      },
    ],
    []
  );

  return (
    <AdminList
      columns={columns}
      onRowSelect={onRowSelect}
      selectedId={selectedId}
      fetcher={fetcher}
      emptyLabel="No installments match these filters."
      options={["name", "email", "packageName", "status", "download"]}
      statusOptions={INSTALLMENT_STATUSES.map((item) => ({
        value: item.id,
        label: item.label,
      }))}
      refreshKey={refreshKey}
      downloadFilename="installments.csv"
    />
  );
}

function InstallmentDrawer({
  installmentId,
  reloadKey = 0,
  onClose,
  onChanged,
}: {
  installmentId: string | null;
  reloadKey?: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const router = useRouter();
  const loadedIdRef = useRef<string | null>(null);
  const [data, setData] = useState<Installment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!installmentId) {
      loadedIdRef.current = null;
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      if (loadedIdRef.current !== installmentId) {
        setLoading(true);
      }
      setError(null);
      try {
        const detail = await getInstallment(installmentId as string);
        if (!cancelled) {
          loadedIdRef.current = installmentId;
          setData(detail);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AdminUnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setData(null);
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [installmentId, reloadKey, router]);

  useEffect(() => {
    function onFocus() {
      if (installmentId) onChanged();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [installmentId, onChanged]);

  return (
    <Sheet
      open={Boolean(installmentId)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border pr-12">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Installment
          </p>
          <SheetTitle className="truncate text-lg">
            {data
              ? `${data.sequence} of ${data.installmentCount} · ${dash(data.customerName)}`
              : "Installment"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Installment details, checkout link, and payment actions.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <AdminStatus loading={loading} error={error}>
            {data ? (
              <InstallmentDrawerBody
                data={data}
                onUpdated={(next) => {
                  setData(next);
                  onChanged();
                }}
              />
            ) : null}
          </AdminStatus>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InstallmentDrawerBody({
  data,
  onUpdated,
}: {
  data: Installment;
  onUpdated: (next: Installment) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusChip
          label={installmentStatusLabel(data.status)}
          tone={installmentStatusTone(data.status)}
        />
        <span className="text-xs text-muted-foreground">
          Due {formatAdminDay(data.dueAt)}
        </span>
      </div>

      <AdminPanel title="Payment">
        <dl className="space-y-3  break-all">
          <AdminFact label="Amount">
            <span className="font-mono">
              {formatStripeAmount(data.amount, data.currency)}
            </span>
          </AdminFact>
          <AdminFact label="Package">{packageLabel(data.packageName)}</AdminFact>
          <AdminFact label="Plan paid">
            <span className="font-mono">
              {formatStripeAmount(data.paidAmount, data.currency)} /{" "}
              {formatStripeAmount(data.totalAmount, data.currency)}
            </span>
          </AdminFact>
          <AdminFact label="Customer">{dash(data.customerName)}</AdminFact>
          <AdminFact label="Email">
            <a
              href={`mailto:${data.customerEmail}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {data.customerEmail}
            </a>
          </AdminFact>
          <AdminFact label="Phone">
            {data.customerPhone ? (
              <a
                href={`tel:${data.customerPhone}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {data.customerPhone}
              </a>
            ) : (
              "—"
            )}
          </AdminFact>
          {data.linkSentAt ? (
            <AdminFact label="Link sent">
              {formatAdminDate(data.linkSentAt)}
            </AdminFact>
          ) : null}
          {data.paidAt ? (
            <AdminFact label="Paid">
              {formatAdminDate(data.paidAt)}
              {data.paidOffline ? " · offline" : ""}
            </AdminFact>
          ) : null}
          {data.failedAt ? (
            <AdminFact label="Failed">
              {formatAdminDate(data.failedAt)}
            </AdminFact>
          ) : null}
          <AdminFact label="ID">
            <span className="font-mono text-xs">{data.id}</span>
          </AdminFact>
        </dl>
      </AdminPanel>

      <AdminPanel title="Collect">
        <InstallmentActions installment={data} onUpdated={onUpdated} />
      </AdminPanel>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href={`/admin/payment-plans/${data.planId}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          View payment plan
        </Link>
        <Link
          href={`/admin/users?user=${encodeURIComponent(data.userId)}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Open user
        </Link>
        {data.leadId ? (
          <Link
            href={`/admin/leads?lead=${encodeURIComponent(data.leadId)}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            Open lead
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function InstallmentStats({ refreshKey }: { refreshKey: number }) {
  const router = useRouter();
  const [counts, setCounts] = useState<InstallmentStatusCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getInstallmentStatusCounts();
        if (!cancelled) setCounts(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AdminUnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setCounts(null);
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, router]);

  const cards = [
    { label: "Total", value: counts?.total },
    { label: "Upcoming", value: counts?.upcoming },
    { label: "Due", value: counts?.due },
    { label: "Link sent", value: counts?.linkSent },
    { label: "Paid", value: counts?.paid },
    { label: "Failed", value: counts?.failed },
    { label: "Overdue", value: counts?.overdue },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border bg-card px-4 py-3 shadow-soft"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            {card.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : error ? (
              "—"
            ) : (
              (card.value ?? 0)
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
