"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import {
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  StatusChip,
  type AdminColumn,
} from "@/components/admin/admin-list";
import { CreatePaymentPlanDialog } from "@/components/admin/create-payment-plan-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { dash, formatAdminDate, formatStripeAmount, packageLabel } from "@/lib/admin-format";
import {
  paymentPlanStatusLabel,
  paymentPlanStatusTone,
} from "@/lib/installments";
import { toast } from "@/lib/toast";
import {
  AdminUnauthorizedError,
  createUser,
  getUser,
  listPaymentPlans,
  listUsers,
  updateUser,
} from "@/services/admin-api";
import type {
  PaymentPlanListItem,
  UpdateUserRequest,
  User,
} from "@/types/admin";
import { PhoneInputField } from "../shared/phone-input";
import { RequiredMark } from "../shared/intake-fields";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function UsersView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [listTick, setListTick] = useState(0);
  const [drawerTick, setDrawerTick] = useState(0);

  const selectedId = searchParams.get("user");

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("user", id);
      else params.delete("user");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="space-y-4">
      <UserTable
        onRowSelect={(row) => setSelectedId(row.id)}
        selectedId={selectedId}
        refreshKey={listTick}
        toolbar={
          <Button
            variant="outline"
            type="button"
            className="h-9 rounded-xl"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3.5" />
            New user
          </Button>
        }
      />
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(user) => {
          setListTick((tick) => tick + 1);
          setSelectedId(user.id);
        }}
      />
      <UserDrawer
        userId={selectedId}
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

function UserTable({
  selectedId,
  onRowSelect,
  refreshKey,
  toolbar,
}: {
  selectedId?: string | null;
  onRowSelect: (row: User) => void;
  refreshKey: number;
  toolbar?: React.ReactNode;
}) {
  const fetcher = useCallback(listUsers, []);
  const columns = useMemo<AdminColumn<User>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        csvValue: (row) => dash(row.name),
        render: (row) => dash(row.name),
      },
      {
        id: "contact",
        header: "Contact",
        className: "font-mono text-xs",
        csvValue: (row) => [dash(row.email), dash(row.phone)].join(" "),
        render: (row) => (
          <div>
            <p>{dash(row.email)}</p>
            <p>{dash(row.phone)}</p>
          </div>
        ),
      },
      {
        id: "lead",
        header: "Lead",
        className: "font-mono text-xs",
        stopRowClick: true,
        csvValue: (row) => dash(row.leadId),
        render: (row) =>
          row.leadId ? (
            <Link
              href={`/admin/leads?lead=${encodeURIComponent(row.leadId)}`}
              className="text-primary underline-offset-4 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {row.leadId}
            </Link>
          ) : (
            "—"
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
    <AdminList
      columns={columns}
      onRowSelect={onRowSelect}
      selectedId={selectedId}
      fetcher={fetcher}
      emptyLabel="No users match these filters."
      options={["name", "email", "download"]}
      refreshKey={refreshKey}
      downloadFilename={`users-${new Date().toISOString().split('T')[0]}.csv`}
      toolbar={toolbar}
    />
  );
}

export function CreateUserDialog({
  open,
  onOpenChange,
  prefill,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string | null;
    leadId?: string | null;
  };
  onCreated: (user: User) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadId, setLeadId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(prefill?.name ?? "");
    setEmail(prefill?.email ?? "");
    setPhone(prefill?.phone ?? "");
    setLeadId(prefill?.leadId ?? "");
    setError(null);
    setSaving(false);
  }, [open, prefill]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();
    if (!nextName || !nextEmail) {
      setError("Name and email are required.");
      return;
    }
    if (!EMAIL_RE.test(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const user = await createUser({
        name: nextName,
        email: nextEmail,
        phone: blankToNull(phone),
        leadId: blankToNull(leadId),
      });
      toast.success("User created", nextName);
      onOpenChange(false);
      onCreated(user);
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) {
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>New user</DialogTitle>
            <DialogDescription>
              Billing contact for payment plans. Optionally link an existing
              lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Field label="Name" htmlFor="user-name">
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Email" htmlFor="user-email">
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="h-9 rounded-xl"
                required
              />
            </Field>
            {/* <Field label="Phone" htmlFor="user-phone">
              <Input
                id="user-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900123"
                className="h-9 rounded-xl"
              />
            </Field> */}
             <div className="space-y-2">
              <Label htmlFor="intake-phone">
                Phone
                <RequiredMark />
              </Label>
              <PhoneInputField
                id="intake-phone"
                value={phone}
                onChange={setPhone}
                disabled={saving}
                required
              />
            </div>
            <Field label="Lead ID" htmlFor="user-lead">
              <p className="text-xs text-muted-foreground">If lead already exists, We recommend creating the user directly from the Lead Drawer instead. Simply click + Create User to create a user in just one click.</p>
              <Input
                id="user-lead"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                placeholder="ld_… optional"
                className="h-9 rounded-xl font-mono text-xs"
              />
            </Field>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Create user
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserDrawer({
  userId,
  reloadKey = 0,
  onClose,
  onChanged,
}: {
  userId: string | null;
  reloadKey?: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const router = useRouter();
  const loadedIdRef = useRef<string | null>(null);
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      loadedIdRef.current = null;
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      if (loadedIdRef.current !== userId) setLoading(true);
      setError(null);
      try {
        const detail = await getUser(userId as string);
        if (!cancelled) {
          loadedIdRef.current = userId;
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
  }, [userId, reloadKey, router]);

  return (
    <Sheet
      open={Boolean(userId)}
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
            User
          </p>
          <SheetTitle className="truncate text-lg">
            {data?.name ?? "User"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            User contact details and payment plans.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <AdminStatus loading={loading} error={error}>
            {data ? (
              <UserDrawerBody
                key={`${data.id}-${data.updatedAt}`}
                data={data}
                onDataChange={setData}
                onChanged={onChanged}
              />
            ) : null}
          </AdminStatus>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UserDrawerBody({
  data,
  onDataChange,
  onChanged,
}: {
  data: User;
  onDataChange: (data: User) => void;
  onChanged: () => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone ?? "");
  const [leadId, setLeadId] = useState(data.leadId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [createPlanOpen, setCreatePlanOpen] = useState(false);

  function resetForm() {
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone ?? "");
    setLeadId(data.leadId ?? "");
    setEditing(false);
    setError(null);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nextPhone = blankToNull(phone);
    const nextLeadId = blankToNull(leadId);

    if (!nextName || !nextEmail) {
      setError("Name and email are required.");
      return;
    }
    if (!EMAIL_RE.test(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    const body: UpdateUserRequest = {};
    if (nextName !== data.name) body.name = nextName;
    if (nextEmail !== data.email) body.email = nextEmail;
    if (nextPhone !== data.phone) body.phone = nextPhone;
    if (nextLeadId !== data.leadId) body.leadId = nextLeadId;

    if (Object.keys(body).length === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await updateUser(data.id, body);
      onDataChange(updated);
      setEditing(false);
      onChanged();
      toast.success("User updated");
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) {
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Updated {formatAdminDate(data.updatedAt)}
      </p>

      <AdminPanel
        title="Contact"
        action={
          editing ? undefined : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg"
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          )
        }
      >
        {editing ? (
          <form onSubmit={handleSave} className="grid gap-3">
            <Field label="Name" htmlFor="edit-user-name">
              <Input
                id="edit-user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Email" htmlFor="edit-user-email">
              <Input
                id="edit-user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Phone" htmlFor="edit-user-phone">
              <Input
                id="edit-user-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 rounded-xl"
              />
            </Field>
            <Field label="Lead ID" htmlFor="edit-user-lead">
              <Input
                id="edit-user-lead"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                placeholder="ld_… or blank to clear"
                className="h-9 rounded-xl font-mono text-xs"
              />
            </Field>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={saving}
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </form>
        ) : (
          <dl className="space-y-3 break-all">
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
            <AdminFact label="Lead">
              {data.leadId ? (
                <Link
                  href={`/admin/leads?lead=${encodeURIComponent(data.leadId)}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Open lead
                </Link>
              ) : (
                "—"
              )}
            </AdminFact>
            <AdminFact label="ID">
              <span className="font-mono text-xs">{data.id}</span>
            </AdminFact>
          </dl>
        )}
      </AdminPanel>

      <UserPaymentPlans
        user={data}
        onCreatePlan={() => setCreatePlanOpen(true)}
      />

      <CreatePaymentPlanDialog
        open={createPlanOpen}
        onOpenChange={setCreatePlanOpen}
        prefill={{ user: data }}
        onCreated={(plan) => {
          onChanged();
          router.push(`/admin/payment-plans/${plan.id}`);
        }}
      />
    </div>
  );
}

function UserPaymentPlans({
  user,
  onCreatePlan,
}: {
  user: User;
  onCreatePlan: () => void;
}) {
  const router = useRouter();
  const [plans, setPlans] = useState<PaymentPlanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await listPaymentPlans({
          userId: user.id,
          limit: 20,
          order: "desc",
        });
        if (!cancelled) setPlans(result.data);
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
  }, [user.id, user.updatedAt, router]);

  return (
    <AdminPanel
      title="Payment plans"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-lg"
          onClick={onCreatePlan}
        >
          <Plus className="size-3.5" />
          New plan
        </Button>
      }
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No installment plans for this user yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {plans.map((plan) => (
            <li key={plan.id}>
              <Link
                href={`/admin/payment-plans/${plan.id}`}
                className="flex items-start justify-between gap-3 rounded-xl border border-border p-3 hover:bg-muted/40"
              >
                <div>
                  <p className="text-sm font-medium">
                    {packageLabel(plan.packageName)}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {formatStripeAmount(plan.paidAmount, plan.currency)} /{" "}
                    {formatStripeAmount(plan.totalAmount, plan.currency)}
                  </p>
                </div>
                <StatusChip
                  label={paymentPlanStatusLabel(plan.status)}
                  tone={paymentPlanStatusTone(plan.status)}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  );
}

export async function ensureUserForLead(lead: {
  id: string;
  name: string;
  email: string;
  phone: string;
}): Promise<User> {
  const byLead = await listUsers({ leadId: lead.id, limit: 1 });
  if (byLead.data[0]) return byLead.data[0];

  try {
    return await createUser({
      name: lead.name,
      email: lead.email,
      phone: lead.phone.trim() ? lead.phone : null,
      leadId: lead.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (!message.toLowerCase().includes("email already in use")) {
      throw err;
    }
    const byEmail = await listUsers({ email: lead.email, limit: 1 });
    const existing = byEmail.data[0];
    if (!existing) throw err;
    if (existing.leadId === lead.id) return existing;
    return updateUser(existing.id, { leadId: lead.id });
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
