"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminUnauthorizedError,
  getPackagePurchase,
  listPackagePurchases,
} from "@/services/admin-api";
import {
  AdminBackLink,
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  type AdminColumn,
} from "@/components/admin/admin-list";
import { dash, formatAdminDate, formatStripeAmount } from "@/lib/admin-format";
import type { AdminPackagePurchase } from "@/types/admin";
import { packages } from "@/data/packages";

const columns: AdminColumn<AdminPackagePurchase>[] = [
  {
    id: "name",
    header: "Name",
    render: (row) => dash(row.customerName),
  },
  {
    id: "email",
    header: "Email",
    className: "font-mono text-xs",
    render: (row) =>{ 
      return (
        <p>{dash(row.customerEmail)}</p>
      )
    },
  },
  {
    id: "phone",
    header: "Phone",
    className: "font-mono text-xs",
    render: (row) => (
      <p>{dash(row.customerPhone)}</p>
    ),
  },
  {
    id: "package",
    header: "Package",
    render: (row) => {
      const rawName = dash(row.packageName);
      const  packageName = packages.find((pkg) => pkg.slug === rawName)?.name;
      return packageName || rawName;
    },
  },
  {
    id: "amount",
    header: "Amount",
    className: "font-mono text-xs",
    render: (row) => formatStripeAmount(row.amount, row.currency),
  },
  {
    id: "updated",
    header: "Updated",
    className: "text-muted-foreground",
    render: (row) => formatAdminDate(row.updatedAt),
  },
];

export function PurchasesView() {
  const fetcher = useCallback(listPackagePurchases, []);

  return (
    <AdminList
      columns={columns}
      rowHref={(row) => `/admin/purchases/${row.id}`}
      fetcher={fetcher}
      emptyLabel="No purchases match these filters."
      options={["name", "email", "packageName", "download"]}
      downloadFilename={`package-purchases-${new Date().toISOString().split('T')[0]}.csv`}
    />
  );
}

export function PurchaseDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<AdminPackagePurchase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const detail = await getPackagePurchase(id);
        if (!cancelled) setData(detail);
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
  }, [id, router]);

  return (
    <div>
      <AdminBackLink href="/admin/purchases" label="All purchases" />
      <AdminStatus loading={loading} error={error}>
        {data ? <PurchaseBody data={data} /> : null}
      </AdminStatus>
    </div>
  );
}

function PurchaseBody({ data }: { data: AdminPackagePurchase }) {
  const rawName = dash(data.packageName);
  const  packageName = packages.find((pkg) => pkg.slug === rawName)?.name;
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          Purchase
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {packageName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {dash(data.customerName)} · {formatAdminDate(data.createdAt)}
        </p>
      </header>

      <AdminPanel title="Payment">
        <dl className="space-y-3">
          <AdminFact label="Amount">
            <span className="font-mono">
              {formatStripeAmount(data.amount, data.currency)}
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
          <AdminFact label="Stripe session">
            <span className="font-mono text-xs">{data.stripeSessionId}</span>
          </AdminFact>
          <AdminFact label="Payment intent">
            <span className="font-mono text-xs">
              {dash(data.stripePaymentIntentId)}
            </span>
          </AdminFact>
          <AdminFact label="Created">
            {formatAdminDate(data.createdAt)}
          </AdminFact>
          <AdminFact label="Updated">
            {formatAdminDate(data.updatedAt)}
          </AdminFact>
          <AdminFact label="ID">
            <span className="font-mono text-xs">{data.id}</span>
          </AdminFact>
        </dl>
      </AdminPanel>
    </div>
  );
}
