"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  AdminList,
  StatusChip,
  type AdminColumn,
} from "@/components/admin/admin-list";
import { dash, formatAdminDate } from "@/lib/admin-format";
import {
  CLEAR_PRIORITY_VALUE,
  isSameLeadOption,
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
import {
  AdminUnauthorizedError,
  createPipeline,
  listLeads,
  updateLead,
} from "@/services/admin-api";
import type { LeadListItem } from "@/types/admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SavingField = "priority" | "status";

type LeadTableProps = {
  selectedId?: string | null;
  onRowSelect: (row: LeadListItem) => void;
  toolbar?: ReactNode;
  refreshKey?: number;
  onInlineChanged?: () => void;
};

export function LeadTable({
  selectedId,
  onRowSelect,
  toolbar,
  refreshKey = 0,
  onInlineChanged,
}: LeadTableProps) {
  const router = useRouter();
  const fetcher = useCallback(listLeads, []);
  const [patches, setPatches] = useState<Record<string, Partial<LeadListItem>>>(
    {}
  );
  const [saving, setSaving] = useState<Record<string, SavingField>>({});

  useEffect(() => {
    setPatches({});
    setSaving({});
  }, [refreshKey]);

  const enhanceRow = useCallback(
    (row: LeadListItem) => ({ ...row, ...patches[row.id] }),
    [patches]
  );

  const handleUnauthorized = useCallback(
    async (err: unknown) => {
      if (err instanceof AdminUnauthorizedError) {
        router.replace("/admin/login");
        return true;
      }
      return false;
    },
    [router]
  );

  const updateRow = useCallback(
    (id: string, patch: Partial<LeadListItem>) => {
      setPatches((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    },
    []
  );

  const handlePriorityChange = useCallback(
    async (row: LeadListItem, nextValue: string) => {
      const nextPriority = parsePriorityValue(nextValue);
      if (isSameLeadOption(nextPriority, row.priority)) return;

      const previous = {
        priority: row.priority,
        updatedAt: row.updatedAt,
      };

      updateRow(row.id, {
        priority: nextPriority,
        updatedAt: new Date().toISOString(),
      });
      setSaving((prev) => ({ ...prev, [row.id]: "priority" }));

      try {
        const updated = await updateLead(row.id, { priority: nextPriority });
        updateRow(row.id, {
          priority: updated.priority,
          updatedAt: updated.updatedAt,
        });
        toast.success("Priority updated", leadPriorityLabel(updated.priority));
        onInlineChanged?.();
      } catch (err) {
        updateRow(row.id, previous);
        if (await handleUnauthorized(err)) return;
        toast.error(
          "Could not update priority",
          err instanceof Error ? err.message : "Request failed"
        );
      } finally {
        setSaving((prev) => {
          const next = { ...prev };
          delete next[row.id];
          return next;
        });
      }
    },
    [handleUnauthorized, onInlineChanged, updateRow]
  );

  const handleStatusChange = useCallback(
    async (row: LeadListItem, nextStatus: string) => {
      if (!nextStatus || isSameLeadOption(nextStatus, row.latestStatus)) return;

      const previous = {
        latestStatus: row.latestStatus,
        updatedAt: row.updatedAt,
      };

      updateRow(row.id, {
        latestStatus: nextStatus,
        updatedAt: new Date().toISOString(),
      });
      setSaving((prev) => ({ ...prev, [row.id]: "status" }));

      try {
        const pipeline = await createPipeline({
          leadId: row.id,
          status: nextStatus,
        });
        updateRow(row.id, {
          latestStatus: pipeline.status,
          updatedAt: pipeline.createdAt,
        });
        toast.success("Status updated", leadStatusLabel(pipeline.status));
        onInlineChanged?.();
      } catch (err) {
        updateRow(row.id, previous);
        if (await handleUnauthorized(err)) return;
        toast.error(
          "Could not update status",
          err instanceof Error ? err.message : "Request failed"
        );
      } finally {
        setSaving((prev) => {
          const next = { ...prev };
          delete next[row.id];
          return next;
        });
      }
    },
    [handleUnauthorized, onInlineChanged, updateRow]
  );

  const columns = useMemo<AdminColumn<LeadListItem>[]>(
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
        id: "secondary",
        header: "Secondary",
        className: "font-mono text-xs text-muted-foreground",
        csvValue: (row) =>
          row.secondaryEmail || row.secondaryPhone
            ? [dash(row.secondaryEmail), dash(row.secondaryPhone)].join(" ")
            : "—",
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
        stopRowClick: true,
        csvValue: (row) => leadPriorityLabel(row.priority),
        render: (row) => (
          <LeadChipMenu
            label={leadPriorityLabel(row.priority)}
            tone={leadPriorityTone(row.priority)}
            saving={saving[row.id] === "priority"}
            ariaLabel="Change priority"
            options={[
              { id: CLEAR_PRIORITY_VALUE, label: "No priority" },
              ...leadPriorityOptions(),
            ]}
            currentId={row.priority ?? CLEAR_PRIORITY_VALUE}
            onSelect={(value) => void handlePriorityChange(row, value)}
          />
        ),
      },
      {
        id: "status",
        header: "Status",
        stopRowClick: true,
        csvValue: (row) => leadStatusLabel(row.latestStatus),
        render: (row) => (
          <LeadChipMenu
            label={leadStatusLabel(row.latestStatus)}
            tone={leadStatusTone(row.latestStatus)}
            saving={saving[row.id] === "status"}
            ariaLabel="Change status"
            options={leadStatusOptions()}
            currentId={row.latestStatus}
            onSelect={(value) => void handleStatusChange(row, value)}
          />
        ),
      },
      {
        id: "notes",
        header: "Notes",
        csvValue: (row) =>
          [String(row.totalNoteCount), dash(row.lastNote)].join(" "),
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
        csvValue: (row) => formatAdminDate(row.updatedAt),
        render: (row) => formatAdminDate(row.updatedAt),
      },
    ],
    [handlePriorityChange, handleStatusChange, saving]
  );

  return (
    <AdminList
      columns={columns}
      onRowSelect={onRowSelect}
      selectedId={selectedId}
      fetcher={fetcher}
      emptyLabel="No leads match these filters."
      options={["name", "email", "download"]}
      refreshKey={refreshKey}
      enhanceRow={enhanceRow}
      toolbar={toolbar}
    />
  );
}

function LeadChipMenu({
  label,
  tone,
  saving,
  ariaLabel,
  options,
  currentId,
  onSelect,
}: {
  label: string;
  tone?: string;
  saving: boolean;
  ariaLabel: string;
  options: { id: string; label: string }[];
  currentId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={saving}
        aria-label={ariaLabel}
        className="inline-flex max-w-full items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <StatusChip label={label} tone={tone} />
        {saving ? (
          <Loader2 className="size-3 animate-spin text-muted-foreground" />
        ) : (
          <ChevronsUpDown className="size-3 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        {options.map((item) => {
          const selected = isSameLeadOption(item.id, currentId);
          return (
            <DropdownMenuItem
              key={item.id}
              disabled={saving}
              onClick={() => onSelect(item.id)}
            >
              <Check
                className={cn(
                  "size-3.5",
                  selected ? "opacity-100" : "opacity-0"
                )}
              />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
