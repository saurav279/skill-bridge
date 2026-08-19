"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AdminUnauthorizedError,
  createLead,
  createNote,
  createPipeline,
  deleteLead,
  getLead,
  getLeadStatusCounts,
  listLeads,
  updateLead,
  updateNote,
} from "@/services/admin-api";
import {
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  StatusChip,
  type AdminColumn,
} from "@/components/admin/admin-list";
import { dash, formatAdminDate } from "@/lib/admin-format";
import {
  CLEAR_PRIORITY_VALUE,
  leadPriorityLabel,
  leadPriorityOptions,
  leadPriorityTone,
  leadStatusLabel,
  leadStatusOptions,
  leadStatusTone,
  parsePriorityValue,
} from "@/lib/lead-status";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type {
  Lead,
  LeadDetail,
  LeadListItem,
  LeadStatusCounts,
  NoteItem,
  UpdateLeadRequest,
} from "@/types/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_NOTED_BY = "Admin";

const columns: AdminColumn<LeadListItem>[] = [
  {
    id: "name",
    header: "Name",
    render: (row) => dash(row.name),
  },
  {
    id: "contact",
    header: "Contact",
    className: "font-mono text-xs",
    render: (row) => (
      <div>
        <p>{dash(row.email)}</p>
        <p>{dash(row.phone)}</p>
      </div>
    ),
  },
  {
    id: "secondary",
    header: "Secondary",
    className: "font-mono text-xs text-muted-foreground",
    render: (row) => {
      if (!row.secondaryEmail && !row.secondaryPhone) return "—";
      return (
        <div>
          <p>{dash(row.secondaryEmail)}</p>
          <p>{dash(row.secondaryPhone)}</p>
        </div>
      );
    },
  },
  {
    id: "priority",
    header: "Priority",
    render: (row) => (
      <StatusChip
        label={leadPriorityLabel(row.priority)}
        tone={leadPriorityTone(row.priority)}
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <StatusChip
        label={leadStatusLabel(row.latestStatus)}
        tone={leadStatusTone(row.latestStatus)}
      />
    ),
  },
  {
    id: "notes",
    header: "Notes",
    render: (row) => (
      <div className="max-w-[240px]">
        <p className="font-mono text-xs text-muted-foreground">
          {row.totalNoteCount}
        </p>
        <p className="truncate text-muted-foreground">{dash(row.lastNote)}</p>
        {row.lastNoteCreatedAt ? (
          <p className="text-xs text-muted-foreground">
            {formatAdminDate(row.lastNoteCreatedAt)}
          </p>
        ) : null}
      </div>
    ),
  },
  {
    id: "updated",
    header: "Updated",
    className: "text-muted-foreground",
    render: (row) => formatAdminDate(row.updatedAt),
  },
];

function blankToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function LeadsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fetcher = useCallback(listLeads, []);
  const [createOpen, setCreateOpen] = useState(false);
  const [listTick, setListTick] = useState(0);

  const selectedId = searchParams.get("lead");

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("lead", id);
      else params.delete("lead");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const refreshList = useCallback(() => {
    setListTick((tick) => tick + 1);
  }, []);

  return (
    <div className="space-y-4">
      <LeadStats refreshKey={listTick} />
      <AdminList
        columns={columns}
        onRowSelect={(row) => setSelectedId(row.id)}
        selectedId={selectedId}
        fetcher={fetcher}
        emptyLabel="No leads match these filters."
        options={["name", "email","download"]}
        refreshKey={listTick}
        toolbar={
          <Button
            type="button"
            className="h-9 rounded-xl"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-3.5" />
            New lead
          </Button>
        }
      />
      <CreateLeadDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(lead) => {
          refreshList();
          setSelectedId(lead.id);
        }}
      />
      <LeadDrawer
        leadId={selectedId}
        onClose={() => setSelectedId(null)}
        onChanged={refreshList}
        onDeleted={() => {
          setSelectedId(null);
          refreshList();
        }}
      />
    </div>
  );
}

function CreateLeadDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (lead: Lead) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) return;
    setName("");
    setEmail("");
    setPhone("");
    setSecondaryEmail("");
    setSecondaryPhone("");
    setPriority("");
    setError(null);
    setSaving(false);
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nextPhone = phone.trim();
    const nextSecondaryEmail = blankToNull(secondaryEmail);
    const nextSecondaryPhone = blankToNull(secondaryPhone);

    if (!nextName || !nextEmail || !nextPhone) {
      setError("Name, email, and phone are required.");
      return;
    }
    if (!EMAIL_RE.test(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (nextSecondaryEmail && !EMAIL_RE.test(nextSecondaryEmail)) {
      setError("Enter a valid secondary email, or leave it blank.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const lead = await createLead({
        name: nextName,
        email: nextEmail,
        phone: nextPhone,
        secondaryEmail: nextSecondaryEmail,
        secondaryPhone: nextSecondaryPhone,
        priority: parsePriorityValue(priority),
      });
      toast.success("Lead created", nextName);
      onOpenChange(false);
      onCreated(lead);
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
            <DialogTitle>New lead</DialogTitle>
            <DialogDescription>
              Contact details and priority. Status and notes are added after
              create.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Field label="Name" htmlFor="lead-name">
              <Input
                id="lead-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Email" htmlFor="lead-email">
              <Input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Phone" htmlFor="lead-phone">
              <Input
                id="lead-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900123"
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <PrioritySelect
              id="lead-priority"
              value={priority}
              onValueChange={setPriority}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Secondary email" htmlFor="lead-secondary-email">
                <Input
                  id="lead-secondary-email"
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="Optional"
                  className="h-9 rounded-xl"
                />
              </Field>
              <Field label="Secondary phone" htmlFor="lead-secondary-phone">
                <Input
                  id="lead-secondary-phone"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="Optional"
                  className="h-9 rounded-xl"
                />
              </Field>
            </div>
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
              Create lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LeadDrawer({
  leadId,
  onClose,
  onChanged,
  onDeleted,
}: {
  leadId: string | null;
  onClose: () => void;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [data, setData] = useState<LeadDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leadId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const detail = await getLead(leadId as string);
        if (!cancelled) setData(detail);
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
  }, [leadId, router]);

  return (
    <Sheet
      open={Boolean(leadId)}
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
            Lead
          </p>
          <SheetTitle className="truncate text-lg">
            {data?.name ?? "Lead"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Lead contact details, pipeline, and notes.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <AdminStatus loading={loading} error={error}>
            {data ? (
              <LeadDrawerBody
                key={data.id}
                data={data}
                onDataChange={setData}
                onChanged={onChanged}
                onDeleted={onDeleted}
              />
            ) : null}
          </AdminStatus>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function LeadDrawerBody({
  data,
  onDataChange,
  onChanged,
  onDeleted,
}: {
  data: LeadDetail;
  onDataChange: (data: LeadDetail) => void;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const latestStatus = data.pipelines.at(-1)?.status ?? null;
  const statusChoices = useMemo(
    () => leadStatusOptions(latestStatus),
    [latestStatus]
  );

  const [status, setStatus] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [note, setNote] = useState("");
  const [notedBy, setNotedBy] = useState(DEFAULT_NOTED_BY);
  const [noteSaving, setNoteSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [secondaryEmail, setSecondaryEmail] = useState(data.secondaryEmail ?? "");
  const [secondaryPhone, setSecondaryPhone] = useState(data.secondaryPhone ?? "");
  const [priority, setPriority] = useState(data.priority ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleUnauthorized(err: unknown) {
    if (err instanceof AdminUnauthorizedError) {
      router.replace("/admin/login");
      return true;
    }
    return false;
  }

  async function handleStatusSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextStatus = status.trim();
    if (!nextStatus) {
      setActionError("Choose a status.");
      return;
    }
    if (nextStatus === latestStatus) {
      setActionError("That is already the current status.");
      return;
    }

    setStatusSaving(true);
    setActionError(null);
    try {
      const pipeline = await createPipeline({
        leadId: data.id,
        status: nextStatus,
      });
      onDataChange({
        ...data,
        pipelines: [...data.pipelines, pipeline],
        updatedAt: pipeline.createdAt,
      });
      setStatus("");
      onChanged();
      toast.success("Status updated", leadStatusLabel(nextStatus));
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      setActionError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleNoteSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextNote = note.trim();
    const nextNotedBy = notedBy.trim();
    if (!nextNote || !nextNotedBy) {
      setActionError("Note and author are required.");
      return;
    }

    setNoteSaving(true);
    setActionError(null);
    try {
      const created = await createNote({
        leadId: data.id,
        note: nextNote,
        notedBy: nextNotedBy.charAt(0).toUpperCase() + nextNotedBy.slice(1),
      });
      onDataChange({
        ...data,
        notes: [...data.notes, created],
        updatedAt: created.createdAt,
      });
      setNote("");
      onChanged();
      toast.success("Note added");
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      setActionError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setNoteSaving(false);
    }
  }

  async function handleNoteEdit(item: NoteItem) {
    const nextNote = editingNote.trim();
    if (!nextNote) {
      setActionError("Note cannot be empty.");
      return;
    }
    if (nextNote === item.note) {
      setEditingId(null);
      return;
    }

    setEditSaving(true);
    setActionError(null);
    try {
      const updated = await updateNote(item.id, { note: nextNote });
      onDataChange({
        ...data,
        notes: data.notes.map((noteItem) =>
          noteItem.id === updated.id ? updated : noteItem
        ),
        updatedAt: updated.updatedAt,
      });
      setEditingId(null);
      onChanged();
      toast.success("Note updated");
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      setActionError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setEditSaving(false);
    }
  }

  function resetContactForm() {
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setSecondaryEmail(data.secondaryEmail ?? "");
    setSecondaryPhone(data.secondaryPhone ?? "");
    setPriority(data.priority ?? "");
    setEditingContact(false);
  }

  async function handleContactSave(event: React.FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nextPhone = phone.trim();
    const nextSecondaryEmail = blankToNull(secondaryEmail);
    const nextSecondaryPhone = blankToNull(secondaryPhone);
    const nextPriority = parsePriorityValue(priority);

    if (!nextName || !nextEmail || !nextPhone) {
      setActionError("Name, email, and phone are required.");
      return;
    }
    if (!EMAIL_RE.test(nextEmail)) {
      setActionError("Enter a valid email address.");
      return;
    }
    if (nextSecondaryEmail && !EMAIL_RE.test(nextSecondaryEmail)) {
      setActionError("Enter a valid secondary email, or leave it blank.");
      return;
    }

    const body: UpdateLeadRequest = {};
    if (nextName !== data.name) body.name = nextName;
    if (nextEmail !== data.email) body.email = nextEmail;
    if (nextPhone !== data.phone) body.phone = nextPhone;
    if (nextSecondaryEmail !== data.secondaryEmail) {
      body.secondaryEmail = nextSecondaryEmail;
    }
    if (nextSecondaryPhone !== data.secondaryPhone) {
      body.secondaryPhone = nextSecondaryPhone;
    }
    if (nextPriority !== data.priority) body.priority = nextPriority;

    if (Object.keys(body).length === 0) {
      setEditingContact(false);
      return;
    }

    setContactSaving(true);
    setActionError(null);
    try {
      const updated = await updateLead(data.id, body);
      onDataChange({
        ...data,
        ...updated,
        pipelines: data.pipelines,
        notes: data.notes,
      });
      setEditingContact(false);
      onChanged();
      toast.success("Lead updated");
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      setActionError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setContactSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteLead(data.id);
      toast.success("Lead deleted", data.name);
      setDeleteOpen(false);
      onDeleted();
    } catch (err) {
      if (await handleUnauthorized(err)) return;
      setActionError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusChip
          label={leadStatusLabel(latestStatus)}
          tone={leadStatusTone(latestStatus)}
        />
        <StatusChip
          label={leadPriorityLabel(data.priority)}
          tone={leadPriorityTone(data.priority)}
        />
        <span className="text-xs text-muted-foreground">
          Updated {formatAdminDate(data.updatedAt)}
        </span>
      </div>

      <AdminPanel
        title="Contact"
        action={
          editingContact ? undefined : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg"
              onClick={() => setEditingContact(true)}
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          )
        }
      >
        {editingContact ? (
          <form onSubmit={handleContactSave} className="grid gap-3">
            <Field label="Name" htmlFor="edit-lead-name">
              <Input
                id="edit-lead-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Email" htmlFor="edit-lead-email">
              <Input
                id="edit-lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <Field label="Phone" htmlFor="edit-lead-phone">
              <Input
                id="edit-lead-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 rounded-xl"
                required
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Secondary email" htmlFor="edit-lead-secondary-email">
                <Input
                  id="edit-lead-secondary-email"
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </Field>
              <Field label="Secondary phone" htmlFor="edit-lead-secondary-phone">
                <Input
                  id="edit-lead-secondary-phone"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="h-9 rounded-xl"
                />
              </Field>
            </div>
            <PrioritySelect
              id="edit-lead-priority"
              value={priority}
              onValueChange={setPriority}
              current={data.priority}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={contactSaving}
                onClick={resetContactForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
                disabled={contactSaving}
              >
                {contactSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
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
            <a
              href={`tel:${data.phone}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {data.phone}
            </a>
          </AdminFact>
          <AdminFact label="Secondary email">
            {data.secondaryEmail ? (
              <a
                href={`mailto:${data.secondaryEmail}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {data.secondaryEmail}
              </a>
            ) : (
              "—"
            )}
          </AdminFact>
          <AdminFact label="Secondary phone">
            {data.secondaryPhone ? (
              <a
                href={`tel:${data.secondaryPhone}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {data.secondaryPhone}
              </a>
            ) : (
              "—"
            )}
          </AdminFact>
          <AdminFact label="Priority">
            {leadPriorityLabel(data.priority)}
          </AdminFact>
          <AdminFact label="Created">
            {formatAdminDate(data.createdAt)}
          </AdminFact>
          <AdminFact label="ID">
            <span className="font-mono text-xs">{data.id}</span>
          </AdminFact>
        </dl>
        )}
      </AdminPanel>

      <AdminPanel title="Pipeline">
        {data.pipelines.length === 0 ? (
          <p className="mb-4 text-sm text-muted-foreground">
            No status yet. Set one below.
          </p>
        ) : (
          <ol className="mb-4 space-y-0">
            {data.pipelines.map((item, index) => {
              const isLatest = index === data.pipelines.length - 1;
              return (
                <li key={item.id} className="flex gap-3">
                  <div className="flex w-3 shrink-0 flex-col items-center">
                    <span
                      className={cn(
                        "mt-1 size-2.5 rounded-full",
                        isLatest ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    />
                    {index < data.pipelines.length - 1 ? (
                      <span className="w-px flex-1 bg-border" />
                    ) : null}
                  </div>
                  <div className={cn("min-w-0 pb-4", isLatest && "pb-1")}>
                    <p className="text-sm font-medium">
                      {leadStatusLabel(item.status)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatAdminDate(item.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <form onSubmit={handleStatusSubmit} className="flex items-end gap-2">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Change status
            </Label>
            <Select
              value={status || null}
              onValueChange={(value) => setStatus(value ?? "")}
            >
              <SelectTrigger className="h-9 w-full rounded-xl">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent className="z-[60]" alignItemWithTrigger={false}>
                {statusChoices.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    disabled={item.id === latestStatus}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="h-9 rounded-xl"
            disabled={statusSaving || !status || status === latestStatus}
          >
            {statusSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </form>
      </AdminPanel>

      <AdminPanel title="Notes">
        {data.notes.length === 0 ? (
          <p className="mb-4 text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <ul className="mb-4 space-y-3">
            {data.notes.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-muted/30 p-3"
              >
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      className="min-h-20 rounded-xl"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl"
                        disabled={editSaving}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="rounded-xl"
                        disabled={editSaving}
                        onClick={() => void handleNoteEdit(item)}
                      >
                        {editSaving ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : null}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {item.note}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">
                        {item.notedBy} · {formatAdminDate(item.updatedAt)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingNote(item.note);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleNoteSubmit} className="space-y-2">
          <Field label="Add a note" htmlFor="lead-note">
            <Textarea
              id="lead-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Called, no answer"
              className="min-h-20 rounded-xl"
            />
          </Field>
          <div className="flex items-end gap-2">
            <Field label="Noted by" htmlFor="lead-noted-by" className="flex-1">
              <Input
                id="lead-noted-by"
                value={notedBy}
                onChange={(e) => setNotedBy(e.target.value)}
                className="h-9 rounded-xl"
              />
            </Field>
            <Button
              type="submit"
              className="h-9 rounded-xl"
              disabled={noteSaving || !note.trim()}
            >
              {noteSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              Add note
            </Button>
          </div>
        </form>
      </AdminPanel>

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <p className="text-sm font-medium">Delete lead</p>
        {deleteOpen ? (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Delete {data.name}? They will disappear from the list, detail, and
              status counts.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={deleting}
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="rounded-xl"
                disabled={deleting}
                onClick={() => void handleDelete()}
              >
                {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
                Delete
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Removes this lead from the list and dashboard. This cannot be
              undone here.
            </p>
            <Button
              type="button"
              variant="destructive"
              className="mt-3 rounded-xl"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
              Delete lead
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function PrioritySelect({
  id,
  value,
  onValueChange,
  current,
}: {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  current?: string | null;
}) {
  const options = leadPriorityOptions(current);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        Priority
      </Label>
      <Select
        value={value || null}
        onValueChange={(next) => onValueChange(parsePriorityValue(next) ?? "")}
      >
        <SelectTrigger id={id} className="h-9 w-full rounded-xl">
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent className="z-[60]" alignItemWithTrigger={false}>
          <SelectItem value={CLEAR_PRIORITY_VALUE}>None</SelectItem>
          {options.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function LeadStats({ refreshKey }: { refreshKey: number }) {
  const router = useRouter();
  const [counts, setCounts] = useState<LeadStatusCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeadStatusCounts();
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
    { label: "High priority", value: counts?.highPriority },
    { label: "Today", value: counts?.todayCount },
    { label: "Last 7 days", value: counts?.weekCount },
    { label: "Last 30 days", value: counts?.monthCount },
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
