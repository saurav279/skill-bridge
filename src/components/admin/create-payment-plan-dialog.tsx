"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { packages } from "@/data/packages";
import {
  dash,
  formatAdminDay,
  formatStripeAmount,
  parseGbpLabelToPence,
  penceToPoundsInput,
  poundsInputToPence,
} from "@/lib/admin-format";
import { splitInstallments } from "@/lib/installments";
import { toast } from "@/lib/toast";
import { getUkToday } from "@/lib/uk-date";
import { cn } from "@/lib/utils";
import {
  AdminUnauthorizedError,
  createPaymentPlan,
  createUser,
  getUser,
  listUsers,
} from "@/services/admin-api";
import type {
  CreatePaymentPlanRequest,
  PaymentPlanDetail,
  PaymentPlanPackageName,
  User,
} from "@/types/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CreatePaymentPlanPrefill = {
  user?: User;
  userId?: string;
};

type DraftRow = {
  amount: string;
  dueAt: string;
};

export function CreatePaymentPlanDialog({
  open,
  onOpenChange,
  prefill,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: CreatePaymentPlanPrefill;
  onCreated: (plan: PaymentPlanDetail) => void;
}) {
  const router = useRouter();
  const lockedUser = prefill?.user ?? null;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createNewUser, setCreateNewUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [packageName, setPackageName] = useState("");
  const [totalPounds, setTotalPounds] = useState("");
  const [installmentCount, setInstallmentCount] = useState("4");
  const [intervalDays, setIntervalDays] = useState("2");
  const [firstDueAt, setFirstDueAt] = useState("");
  const [customSplit, setCustomSplit] = useState(false);
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedUser(lockedUser);
    setCreateNewUser(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setPackageName("");
    setTotalPounds("");
    setInstallmentCount("4");
    setIntervalDays("2");
    setFirstDueAt(getUkToday());
    setCustomSplit(false);
    setRows([]);
    setError(null);
    setSaving(false);

    const userId = prefill?.userId;
    if (lockedUser || !userId) return;

    let cancelled = false;
    void getUser(userId)
      .then((user) => {
        if (!cancelled) setSelectedUser(user);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof AdminUnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load user");
      });

    return () => {
      cancelled = true;
    };
  }, [open, lockedUser, prefill?.userId, router]);

  const count = clampInt(installmentCount, 2, 24, 4);
  const interval = clampInt(intervalDays, 1, 365, 2);
  const totalPence = poundsInputToPence(totalPounds);
  const userLocked = Boolean(lockedUser || prefill?.userId);

  const preview = useMemo(() => {
    if (!totalPence || !firstDueAt) return [];
    return splitInstallments(totalPence, count, interval, firstDueAt);
  }, [totalPence, count, interval, firstDueAt]);

  useEffect(() => {
    if (!customSplit) return;
    setRows((current) => {
      if (current.length === preview.length) return current;
      return preview.map((row) => ({
        amount: penceToPoundsInput(row.amount),
        dueAt: row.dueAt,
      }));
    });
  }, [customSplit, preview]);

  function handlePackageChange(slug: string) {
    setPackageName(slug);
    const pkg = packages.find((item) => item.slug === slug);
    if (!pkg?.priceLabel) return;
    const pence = parseGbpLabelToPence(pkg.priceLabel);
    if (pence) setTotalPounds(penceToPoundsInput(pence));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!packageName) {
      setError("Choose a package.");
      return;
    }
    if (!totalPence) {
      setError("Enter a total amount greater than zero.");
      return;
    }
    if (!firstDueAt) {
      setError("Choose the first due date.");
      return;
    }

    const schedule = customSplit
      ? rows.map((row) => ({
          amount: poundsInputToPence(row.amount),
          dueAt: row.dueAt,
        }))
      : preview;

    if (schedule.length !== count) {
      setError(`Schedule must have ${count} installments.`);
      return;
    }

    const installments: Array<{ amount: number; dueAt: string }> = [];
    for (const row of schedule) {
      if (!row.amount || !row.dueAt) {
        setError("Each installment needs an amount and due date.");
        return;
      }
      installments.push({ amount: row.amount, dueAt: row.dueAt });
    }

    const sum = installments.reduce((acc, row) => acc + row.amount, 0);
    if (sum !== totalPence) {
      setError(
        `Installment amounts must sum to ${formatStripeAmount(totalPence, "gbp")} (currently ${formatStripeAmount(sum, "gbp")}).`
      );
      return;
    }

    const body: CreatePaymentPlanRequest = {
      userId: "",
      packageName: packageName as PaymentPlanPackageName,
      totalAmount: totalPence,
      currency: "gbp",
      installmentCount: count,
      intervalDays: interval,
      firstDueAt: installments[0]?.dueAt ?? firstDueAt,
      installments,
    };

    setSaving(true);
    setError(null);
    try {
      let userId = selectedUser?.id ?? "";
      if (!userLocked && createNewUser) {
        const nextName = newName.trim();
        const nextEmail = newEmail.trim();
        if (!nextName || !nextEmail) {
          setError("Name and email are required to create a user.");
          setSaving(false);
          return;
        }
        if (!EMAIL_RE.test(nextEmail)) {
          setError("Enter a valid email address.");
          setSaving(false);
          return;
        }
        const user = await createUser({
          name: nextName,
          email: nextEmail,
          phone: newPhone.trim() ? newPhone.trim() : null,
          leadId: null,
        });
        userId = user.id;
      }

      if (!userId) {
        setError("Select a user, or create one.");
        setSaving(false);
        return;
      }

      body.userId = userId;
      const plan = await createPaymentPlan(body);
      toast.success("Payment plan created", plan.customerName);
      onOpenChange(false);
      onCreated(plan);
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

  const customSum = rows.reduce((acc, row) => {
    return acc + (poundsInputToPence(row.amount) ?? 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>New payment plan</DialogTitle>
            <DialogDescription>
              Attach a user, then split one package total into scheduled
              installments. Stripe links are created later.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {userLocked ? (
              <SelectedUserCard user={selectedUser} />
            ) : (
              <>
                {/* <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={createNewUser}
                    onChange={(e) => {
                      setCreateNewUser(e.target.checked);
                      if (e.target.checked) setSelectedUser(null);
                    }}
                    className="size-4 rounded border-input"
                  />
                  Create a new user
                </label> */}
                {createNewUser ? (
                  <>
                    <Field label="Name" htmlFor="plan-user-name">
                      <Input
                        id="plan-user-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Jane Doe"
                        className="h-9 rounded-xl"
                        required
                      />
                    </Field>
                    <Field label="Email" htmlFor="plan-user-email">
                      <Input
                        id="plan-user-email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="h-9 rounded-xl"
                        required
                      />
                    </Field>
                    <Field label="Phone" htmlFor="plan-user-phone">
                      <Input
                        id="plan-user-phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+44 7700 900123"
                        className="h-9 rounded-xl"
                      />
                    </Field>
                  </>
                ) : (
                  <UserPicker
                    selected={selectedUser}
                    onSelect={setSelectedUser}
                  />
                )}
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="plan-package" className="text-xs text-muted-foreground">
                Package
              </Label>
              <Select
                value={packageName || null}
                onValueChange={(value) => handlePackageChange(value ?? "")}
              >
                <SelectTrigger id="plan-package" className="h-9 w-full rounded-xl">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent className="z-[60]" alignItemWithTrigger={false}>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.slug} value={pkg.slug}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Total (£)" htmlFor="plan-total">
                <Input
                  id="plan-total"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={totalPounds}
                  onChange={(e) => setTotalPounds(e.target.value)}
                  placeholder="6000.00"
                  className="h-9 rounded-xl"
                  required
                />
              </Field>
              <Field label="First due date" htmlFor="plan-first-due">
                <Input
                  id="plan-first-due"
                  type="date"
                  value={firstDueAt}
                  onChange={(e) => setFirstDueAt(e.target.value)}
                  className="h-9 rounded-xl"
                  required
                />
              </Field>
              <Field label="Installments" htmlFor="plan-count">
                <Input
                  id="plan-count"
                  type="number"
                  min={2}
                  max={24}
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </Field>
              <Field label="Every (days)" htmlFor="plan-interval">
                <Input
                  id="plan-interval"
                  type="number"
                  min={1}
                  max={365}
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={customSplit}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setCustomSplit(checked);
                  if (checked) {
                    setRows(
                      preview.map((row) => ({
                        amount: penceToPoundsInput(row.amount),
                        dueAt: row.dueAt,
                      }))
                    );
                  }
                }}
                className="size-4 rounded border-input"
              />
              Set amounts and dates myself
            </label>

            {customSplit ? (
              <div className="space-y-2 rounded-xl border border-border p-3">
                {rows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto_1fr_1fr] items-end gap-2"
                  >
                    <p className="pb-2 font-mono text-xs text-muted-foreground">
                      {index + 1}/{count}
                    </p>
                    <Field
                      label="Amount (£)"
                      htmlFor={`plan-row-amount-${index}`}
                    >
                      <Input
                        id={`plan-row-amount-${index}`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={row.amount}
                        onChange={(e) => {
                          const next = [...rows];
                          next[index] = { ...row, amount: e.target.value };
                          setRows(next);
                        }}
                        className="h-9 rounded-xl"
                      />
                    </Field>
                    <Field label="Due" htmlFor={`plan-row-due-${index}`}>
                      <Input
                        id={`plan-row-due-${index}`}
                        type="date"
                        value={row.dueAt}
                        onChange={(e) => {
                          const next = [...rows];
                          next[index] = { ...row, dueAt: e.target.value };
                          setRows(next);
                        }}
                        className="h-9 rounded-xl"
                      />
                    </Field>
                  </div>
                ))}
                <p
                  className={cn(
                    "text-xs",
                    totalPence && customSum !== totalPence
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  Split total {formatStripeAmount(customSum, "gbp")}
                  {totalPence
                    ? ` of ${formatStripeAmount(totalPence, "gbp")}`
                    : ""}
                </p>
              </div>
            ) : preview.length > 0 ? (
              <div className="rounded-xl border border-border p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Schedule preview
                </p>
                <ul className="space-y-1.5">
                  {preview.map((row, index) => (
                    <li
                      key={`${row.dueAt}-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {index + 1} of {count} · {formatAdminDay(row.dueAt)}
                      </span>
                      <span className="font-mono text-xs">
                        {formatStripeAmount(row.amount, "gbp")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
         
         {!selectedUser?.leadId && !createNewUser ? (
          <p className="text-sm text-muted-foreground">
            This user does not have a lead ID.
          </p>
        ) : null}

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
            <Button type="submit" className="rounded-xl" disabled={saving || !selectedUser?.leadId}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Create plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserPicker({
  selected,
  onSelect,
}: {
  selected: User | null;
  onSelect: (user: User | null) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const looksLikeEmail = debounced.includes("@");
        const data = await listUsers({
          limit: 8,
          order: "desc",
          ...(debounced
            ? looksLikeEmail
              ? { email: debounced }
              : { name: debounced }
            : {}),
        });
        if (!cancelled) setResults(data.data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AdminUnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [debounced, router]);

  if (selected) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{dash(selected.name)}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {selected.email}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-lg"
          onClick={() => onSelect(null)}
        >
          <X className="size-3.5" />
          Change
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Field label="User" htmlFor="plan-user-search">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="plan-user-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            className="h-9 rounded-xl pl-8"
          />
        </div>
      </Field>
      <div className="max-h-44 overflow-y-auto rounded-xl border border-border">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No users match. Create a new user instead.
          </p>
        ) : (
          <ul>
            {results.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-muted/40"
                  onClick={() => onSelect(user)}
                >
                  <span className="text-sm font-medium">{dash(user.name)}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SelectedUserCard({ user }: { user: User | null }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Loading user
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-xs text-muted-foreground">User</p>
      <p className="mt-0.5 text-sm font-medium">{dash(user.name)}</p>
      <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
    </div>
  );
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

function clampInt(value: string, min: number, max: number, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}
