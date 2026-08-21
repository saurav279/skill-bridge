"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminUnauthorizedError,
  getContactMessage,
  listContactMessages,
} from "@/services/admin-api";
import {
  AdminBackLink,
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  type AdminColumn,
} from "@/components/admin/admin-list";
import {
  contactPreferenceLabel,
  dash,
  formatAdminDate,
} from "@/lib/admin-format";
import type { AdminContactMessage } from "@/types/admin";

const columns: AdminColumn<AdminContactMessage>[] = [
  {
    id: "name",
    header: "Name",
    render: (row) => dash(row.name),
  },
  {
    id: "email",
    header: "Email",
    className: "font-mono text-xs",
    render: (row) => dash(row.email),
  },
  {
    id: "phone",
    header: "Phone",
    className: "font-mono text-xs",
    render: (row) =>  dash(row.phone),
  },
  {
    id: "subject",
    header: "Subject",
    render: (row) => dash(row.subject),
  },
  {
    id: "prefered",
    header: "Prefers",
    render: (row) => contactPreferenceLabel(row.prefered),
  },
  {
    id: "updated",
    header: "Updated",
    className: "text-muted-foreground",
    render: (row) => formatAdminDate(row.updatedAt),
  },
];

export function ContactsView() {
  const fetcher = useCallback(listContactMessages, []);

  return (
    <AdminList
      columns={columns}
      rowHref={(row) => `/admin/contacts/${row.id}`}
      fetcher={fetcher}
      emptyLabel="No contact messages match these filters."
      options={["name", "email", "download"]}
      downloadFilename={`contacts-${new Date().toISOString().split('T')[0]}.csv`}
    />
  );
}

export function ContactDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<AdminContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const detail = await getContactMessage(id);
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
      <AdminBackLink href="/admin/contacts" label="All messages" />
      <AdminStatus loading={loading} error={error}>
        {data ? <ContactBody data={data} /> : null}
      </AdminStatus>
    </div>
  );
}

function ContactBody({ data }: { data: AdminContactMessage }) {
  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          Contact
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {dash(data.subject)}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          From {dash(data.name)} · {formatAdminDate(data.createdAt)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <AdminPanel title="Message">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {data.message}
          </p>
        </AdminPanel>

        <AdminPanel title="Details">
          <dl className="space-y-3  break-all">
            <AdminFact label="Name">{dash(data.name)}</AdminFact>
            <AdminFact label="Email">
              <a
                href={`mailto:${data.email}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {data.email}
              </a>
            </AdminFact>
            <AdminFact label="Phone">
              {data.phone ? (
                <a
                  href={`tel:${data.phone}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {data.phone}
                </a>
              ) : (
                "—"
              )}
            </AdminFact>
            <AdminFact label="Lives in UK">
              {data.livesInUk ? "Yes" : "No"}
            </AdminFact>
            <AdminFact label="Current visa">
              {dash(data.currentVisa)}
            </AdminFact>
            <AdminFact label="Prefers">
              {contactPreferenceLabel(data.prefered)}
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
    </div>
  );
}
