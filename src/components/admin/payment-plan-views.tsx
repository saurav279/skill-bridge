"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import {
  AdminBackLink,
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  StatusChip,
  type AdminColumn,
} from "@/components/admin/admin-list";
import { CreatePaymentPlanDialog } from "@/components/admin/create-payment-plan-dialog";
import { InstallmentActions } from "@/components/admin/installment-actions";
import { Button } from "@/components/ui/button";
import {
  dash,
  formatAdminDate,
  formatAdminDay,
  formatStripeAmount,
  packageLabel,
} from "@/lib/admin-format";
import {
  PAYMENT_PLAN_STATUSES,
  installmentStatusLabel,
  installmentStatusTone,
  paymentPlanStatusLabel,
  paymentPlanStatusTone,
} from "@/lib/installments";
import { toast } from "@/lib/toast";
import {
  AdminUnauthorizedError,
  cancelPaymentPlan,
  getPaymentPlan,
  getPaymentPlanStatusCounts,
  listPaymentPlans,
} from "@/services/admin-api";
import type {
  Installment,
  PaymentPlanDetail,
  PaymentPlanListItem,
  PaymentPlanStatusCounts,
} from "@/types/admin";
import { cn } from "@/lib/utils";

export function PaymentPlansView() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [listTick, setListTick] = useState(0);
  const fetcher = useCallback(listPaymentPlans, []);

  const columns = useMemo<AdminColumn<PaymentPlanListItem>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        csvValue: (row) => dash(row.customerName),
        render: (row) => dash(row.customerName),
      },
      {
        id: "email",
        header: "Email",
        className: "font-mono text-xs",
        csvValue: (row) =>
          dash(row.customerEmail),
        render: (row) => (
          <p>{dash(row.customerEmail)}</p>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        className: "font-mono text-xs",
        csvValue: (row) =>
          dash(row.customerPhone),
        render: (row) => (
          <p>{dash(row.customerPhone)}</p>
        ),
      },
      {
        id: "package",
        header: "Package",
        csvValue: (row) => packageLabel(row.packageName),
        render: (row) => packageLabel(row.packageName),
      },
      {
        id: "progress",
        header: "Paid / total",
        className: "font-mono text-xs",
        csvValue: (row) =>
          `${formatStripeAmount(row.paidAmount, row.currency)} / ${formatStripeAmount(row.totalAmount, row.currency)}`,
        render: (row) => (
          <div>
            <p>
              {formatStripeAmount(row.paidAmount, row.currency)} /{" "}
              {formatStripeAmount(row.totalAmount, row.currency)}
            </p>
            <p className="text-muted-foreground">
              {row.paidCount} of {row.installmentCount}
            </p>
          </div>
        ),
      },
      {
        id: "next",
        header: "Next due",
        csvValue: (row) =>
          row.nextDueAt ? formatAdminDay(row.nextDueAt) : "—",
        render: (row) =>
          row.nextDueAt ? formatAdminDay(row.nextDueAt) : "—",
      },
      {
        id: "status",
        header: "Status",
        csvValue: (row) => paymentPlanStatusLabel(row.status),
        render: (row) => (
          <StatusChip
            label={paymentPlanStatusLabel(row.status)}
            tone={paymentPlanStatusTone(row.status)}
          />
        ),
      },
      {
        id: "updated",
        header: "Updated",
        className: "text-muted-foreground",
        csvValue: (row) => formatAdminDate(row.updatedAt),
        render: (row) => formatAdminDate(row.updatedAt),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <PaymentPlanStats refreshKey={listTick} />
      <AdminList
        columns={columns}
        rowHref={(row) => `/admin/payment-plans/${row.id}`}
        fetcher={fetcher}
        emptyLabel="No payment plans match these filters."
        options={["name", "email", "packageName", "status", "download"]}
        statusOptions={PAYMENT_PLAN_STATUSES.map((item) => ({
          value: item.id,
          label: item.label,
        }))}
        refreshKey={listTick}
        downloadFilename={`payment-plans-${new Date().toISOString().split('T')[0]}.csv`}
        toolbar={
          <Button
            variant="outline"
            type="button"
            className="h-9 rounded-xl"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3.5" />
            New plan
          </Button>
        }
      />
      <CreatePaymentPlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(plan) => {
          setListTick((tick) => tick + 1);
          router.push(`/admin/payment-plans/${plan.id}`);
        }}
      />
    </div>
  );
}

export function PaymentPlanDetailView({ id }: { id: string }) {
  const router = useRouter();
  const loadedIdRef = useRef<string | null>(null);
  const [data, setData] = useState<PaymentPlanDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (loadedIdRef.current !== id) {
        setLoading(true);
      }
      setError(null);
      try {
        const detail = await getPaymentPlan(id);
        if (!cancelled) {
          loadedIdRef.current = id;
          setData(detail);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AdminUnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, router, reloadKey]);

  useEffect(() => {
    function onFocus() {
      refresh();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  function handleInstallmentUpdated(next: Installment) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        installments: prev.installments.map((item) =>
          item.id === next.id ? next : item
        ),
        paidAmount: next.paidAmount,
        remainingAmount: Math.max(0, next.totalAmount - next.paidAmount),
        totalAmount: next.totalAmount,
        paidCount: prev.installments.filter((item) =>
          item.id === next.id ? next.status === "paid" : item.status === "paid"
        ).length,
      };
    });
    refresh();
  }

  return (
    <div>
      <AdminBackLink href="/admin/payment-plans" label="All payment plans" />
      <AdminStatus loading={loading} error={error}>
        {data ? (
          <PaymentPlanBody
            data={data}
            onRefresh={refresh}
            onUpdated={setData}
            onInstallmentUpdated={handleInstallmentUpdated}
          />
        ) : null}
      </AdminStatus>
    </div>
  );
}

function PaymentPlanBody({
  data,
  onRefresh,
  onUpdated,
  onInstallmentUpdated,
}: {
  data: PaymentPlanDetail;
  onRefresh: () => void;
  onUpdated: (data: PaymentPlanDetail) => void;
  onInstallmentUpdated: (installment: Installment) => void;
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const paidRatio =
    data.totalAmount > 0
      ? Math.min(100, Math.round((data.paidAmount / data.totalAmount) * 100))
      : 0;

  async function handleCancel() {
    setCancelling(true);
    try {
      const next = await cancelPaymentPlan(data.id);
      onUpdated(next);
      setConfirmCancel(false);
      toast.success("Payment plan cancelled");
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) {
        router.replace("/admin/login");
        return;
      }
      toast.error(
        "Could not cancel plan",
        err instanceof Error ? err.message : "Request failed"
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Payment plan
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {dash(data.customerName)}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {packageLabel(data.packageName)} · {formatAdminDay(data.firstDueAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip
            label={paymentPlanStatusLabel(data.status)}
            tone={paymentPlanStatusTone(data.status)}
          />
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl"
            onClick={onRefresh}
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
        </div>
      </header>

      <AdminPanel title="Summary">
        <dl className="space-y-3">
          <AdminFact label="Total">
            <span className="font-mono">
              {formatStripeAmount(data.totalAmount, data.currency)}
            </span>
          </AdminFact>
          <AdminFact label="Paid">
            <span className="font-mono">
              {formatStripeAmount(data.paidAmount, data.currency)}
            </span>
          </AdminFact>
          <AdminFact label="Remaining">
            <span className="font-mono">
              {formatStripeAmount(data.remainingAmount, data.currency)}
            </span>
          </AdminFact>
          <AdminFact label="Schedule">
            {data.paidCount} of {data.installmentCount} paid · every{" "}
            {data.intervalDays} {data.intervalDays === 1 ? "day" : "days"}
          </AdminFact>
          <AdminFact label="Next due">
            {data.nextDueAt ? formatAdminDay(data.nextDueAt) : "—"}
          </AdminFact>
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
          <AdminFact label="User">
            <Link
              href={`/admin/users?user=${encodeURIComponent(data.userId)}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              Open user
            </Link>
          </AdminFact>
          {data.leadId ? (
            <AdminFact label="Lead">
              <Link
                href={`/admin/leads?lead=${encodeURIComponent(data.leadId)}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                Open lead
              </Link>
            </AdminFact>
          ) : null}
          <AdminFact label="ID">
            <span className="font-mono text-xs">{data.id}</span>
          </AdminFact>
        </dl>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Collected</span>
            <span className="font-mono">{paidRatio}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${paidRatio}%` }}
            />
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Installments">
        <ol className="space-y-3">
          {data.installments.map((item) => (
            <li
              key={item.id}
              className={cn(
                "rounded-xl border border-border p-4",
                item.status === "paid" && "bg-muted/20"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {item.sequence} of {item.installmentCount}
                    </p>
                    <StatusChip
                      label={installmentStatusLabel(item.status)}
                      tone={installmentStatusTone(item.status)}
                    />
                  </div>
                  <p className="mt-1 font-mono text-sm">
                    {formatStripeAmount(item.amount, item.currency)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Due {formatAdminDay(item.dueAt)}
                    {item.linkSentAt
                      ? ` · emailed ${formatAdminDate(item.linkSentAt)}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <InstallmentActions
                  installment={item}
                  onUpdated={onInstallmentUpdated}
                />
              </div>
            </li>
          ))}
        </ol>
      </AdminPanel>

      {data.status !== "cancelled" ? (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-sm font-medium">Cancel remaining payments</p>
          {confirmCancel ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Unpaid installments become cancelled. Already-paid ones stay
                paid.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={cancelling}
                  onClick={() => setConfirmCancel(false)}
                >
                  Keep plan
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl"
                  disabled={cancelling}
                  onClick={() => void handleCancel()}
                >
                  {cancelling ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Cancel plan
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Stop collecting remaining installments on this plan.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="mt-3 rounded-xl"
                onClick={() => setConfirmCancel(true)}
              >
                Cancel remaining
              </Button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function PaymentPlanStats({ refreshKey }: { refreshKey: number }) {
  const router = useRouter();
  const [counts, setCounts] = useState<PaymentPlanStatusCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentPlanStatusCounts();
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
    { label: "On track", value: counts?.onTrack },
    { label: "Overdue", value: counts?.overdue },
    { label: "Complete", value: counts?.complete },
    { label: "Cancelled", value: counts?.cancelled },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
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
