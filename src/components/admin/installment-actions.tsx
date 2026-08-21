"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Mail, Pencil } from "lucide-react";
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
  formatAdminDate,
  formatAdminDay,
  formatStripeAmount,
  penceToPoundsInput,
  poundsInputToPence,
} from "@/lib/admin-format";
import {
  copyText,
  isCheckoutExpired,
  isInstallmentLocked,
} from "@/lib/installments";
import { toast } from "@/lib/toast";
import {
  AdminUnauthorizedError,
  createInstallmentCheckout,
  emailInstallment,
  updateInstallment,
} from "@/services/admin-api";
import type { Installment } from "@/types/admin";

type BusyAction = "email" | "paid" | "edit" | "copy" | null;

export function InstallmentActions({
  installment,
  onUpdated,
}: {
  installment: Installment;
  onUpdated: (next: Installment) => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<BusyAction>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const locked = isInstallmentLocked(installment.status);
  const liveLink =
    installment.checkoutUrl &&
    !isCheckoutExpired(installment.checkoutExpiresAt);

  async function handleUnauthorized(err: unknown) {
    if (err instanceof AdminUnauthorizedError) {
      router.replace("/admin/login");
      return true;
    }
    return false;
  }

  async function withBusy(action: BusyAction, run: () => Promise<void>) {
    setBusy(action);
    try {
      await run();
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      toast.error(
        "Could not update installment",
        err instanceof Error ? err.message : "Request failed"
      );
    } finally {
      setBusy(null);
    }
  }

  async function ensureCheckout() {
    if (liveLink && installment.checkoutUrl) return installment;
    const next = await createInstallmentCheckout(installment.id);
    onUpdated(next);
    return next;
  }

  function handleCopy() {
    void withBusy("copy", async () => {
      const next = await ensureCheckout();
      if (!next.checkoutUrl) {
        throw new Error("Checkout URL was not created.");
      }
      await copyText(next.checkoutUrl);
      toast.success("Checkout link copied");
    });
  }

  function handleEmail() {
    void withBusy("email", async () => {
      const result = await emailInstallment(installment.id);
      onUpdated(result.installment);
      toast.success(result.message || "Installment email sent.");
    });
  }

  function handleMarkPaid() {
    void withBusy("paid", async () => {
      const next = await updateInstallment(installment.id, {
        paidOffline: true,
      });
      onUpdated(next);
      setPaidOpen(false);
      toast.success("Marked as paid", "Recorded as an offline payment.");
    });
  }

  function openEdit() {
    setAmount(penceToPoundsInput(installment.amount));
    setDueAt(installment.dueAt);
    setEditError(null);
    setEditOpen(true);
  }

  async function handleEdit(event: React.FormEvent) {
    event.preventDefault();
    const nextAmount = poundsInputToPence(amount);
    const nextDue = dueAt.trim();
    if (!nextAmount && !nextDue) {
      setEditError("Enter an amount or due date.");
      return;
    }

    const body: { amount?: number; dueAt?: string } = {};
    if (nextAmount && nextAmount !== installment.amount) {
      body.amount = nextAmount;
    }
    if (nextDue && nextDue !== installment.dueAt) {
      body.dueAt = nextDue;
    }
    if (Object.keys(body).length === 0) {
      setEditOpen(false);
      return;
    }

    setEditError(null);
    setBusy("edit");
    try {
      const next = await updateInstallment(installment.id, body);
      onUpdated(next);
      setEditOpen(false);
      toast.success("Installment updated");
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      setEditError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      {installment.checkoutUrl ? (
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Checkout link</p>
          <p className="mt-1 break-all font-mono text-[11px]">
            {installment.checkoutUrl}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {liveLink
              ? `Expires ${formatAdminDate(installment.checkoutExpiresAt ?? "")}`
              : "This link has expired. Generate a new one before sending."}
          </p>
        </div>
      ) : null}

      {locked ? (
        <p className="text-sm text-muted-foreground">
          {installment.status === "paid"
            ? installment.paidOffline
              ? `Paid offline${installment.paidAt ? ` · ${formatAdminDate(installment.paidAt)}` : ""}.`
              : `Paid${installment.paidAt ? ` · ${formatAdminDate(installment.paidAt)}` : ""}.`
            : "This installment is cancelled."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="h-9 rounded-xl"
            disabled={busy !== null}
            onClick={handleCopy}
          >
            {busy === "copy" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {liveLink ? "Copy link" : "Generate link"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl"
            disabled={busy !== null}
            onClick={handleEmail}
          >
            {busy === "email" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Mail className="size-3.5" />
            )}
            Email client
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl"
            disabled={busy !== null}
            onClick={openEdit}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl"
            disabled={busy !== null}
            onClick={() => setPaidOpen(true)}
          >
            Mark paid offline
          </Button>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <form onSubmit={handleEdit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Edit installment</DialogTitle>
              <DialogDescription>
                Change the amount or due date. Changing the amount also updates
                the plan total.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-inst-amount" className="text-xs text-muted-foreground">
                  Amount (£)
                </Label>
                <Input
                  id="edit-inst-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-inst-due" className="text-xs text-muted-foreground">
                  Due date
                </Label>
                <Input
                  id="edit-inst-due"
                  type="date"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </div>
              {editError ? (
                <p className="text-sm text-destructive" role="alert">
                  {editError}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={busy === "edit"}
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={busy === "edit"}>
                {busy === "edit" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={paidOpen} onOpenChange={setPaidOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Mark as paid offline</DialogTitle>
            <DialogDescription>
              Record {formatStripeAmount(installment.amount, installment.currency)}{" "}
              for installment {installment.sequence} of{" "}
              {installment.installmentCount}, due {formatAdminDay(installment.dueAt)},
              as paid without Stripe.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={busy === "paid"}
              onClick={() => setPaidOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              disabled={busy === "paid"}
              onClick={handleMarkPaid}
            >
              {busy === "paid" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Mark paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
