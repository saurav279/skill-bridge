"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminUnauthorizedError,
  getAssessment,
  listAssessments,
} from "@/services/admin-api";
import {
  AdminBackLink,
  AdminFact,
  AdminList,
  AdminPanel,
  AdminStatus,
  ExternalOrDash,
  ScorePill,
  type AdminColumn,
} from "@/components/admin/admin-list";
import {
  dash,
  formatAdminDate,
  formatAnswer,
  questionLabel,
  routeLabel,
  sectionLabel,
} from "@/lib/admin-format";
import type {
  AdminAssessmentDetail,
  AdminAssessmentListItem,
  AssessSectionAnswers,
} from "@/types/admin";
import { cn } from "@/lib/utils";
import Link from "next/link";

const columns: AdminColumn<AdminAssessmentListItem>[] = [
  {
    id: "name",
    header: "Name",
    render: (row) => dash(row.contactName),
  },
  {
    id: "contact",
    header: "Contact",
    className: "font-mono text-xs",
    render: (row) =>{ 
      return (
        <div>
          <p>{dash(row.contactEmail)}</p>
          <p>{dash(row.phone)}</p>
        </div>
      )
    },
  },
  {
    id: "route",
    header: "Route",
    render: (row) => routeLabel(row.routeId),
  },
  {
    id: "score",
    header: "Score",
    render: (row) => <ScorePill score={row.confidenceScore} />,
  },
  {
    id: "updated",
    header: "Updated",
    className: "text-muted-foreground",
    render: (row) => formatAdminDate(row.updatedAt),
  },
];

export function AssessmentsView() {
  const fetcher = useCallback(listAssessments, []);

  return (
    <AdminList
      columns={columns}
      rowHref={(row) => `/admin/assessments/${row.id}`}
      fetcher={fetcher}
      emptyLabel="No assessments match these filters."
      options={["name", "email"]}
    />
  );
}

export function AssessmentDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<AdminAssessmentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const detail = await getAssessment(id);
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
      <AdminBackLink href="/admin/assessments" label="All assessments" />
      <AdminStatus loading={loading} error={error}>
        {data ? <AssessmentBody data={data} /> : null}
      </AdminStatus>
    </div>
  );
}

function AssessmentBody({ data }: { data: AdminAssessmentDetail }) {
  const report = data.report;
  const sections = Object.entries(data.payload).filter(
    (entry): entry is [string, AssessSectionAnswers] =>
      entry[0] !== "routeId" &&
      entry[0] !== "resumeLink" &&
      typeof entry[1] === "object" &&
      entry[1] != null &&
      !Array.isArray(entry[1])
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            {routeLabel(data.routeId)}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {dash(data.contactName)}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {report.headline}
          </p>
        </div>
        <ScorePill score={data.confidenceScore} />
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <AdminPanel title="Report">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {report.summary}
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              {report.overallRecommendation}
            </p>
          </AdminPanel>

          {report.breakdown.length ? (
            <AdminPanel title="Breakdown">
              <ul className="space-y-3">
                {report.breakdown.map((item) => (
                  <li key={item.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {Math.round(item.score)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </AdminPanel>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <AdminPanel title="Strengths">
              <ListOrEmpty items={report.strengths} />
            </AdminPanel>
            <AdminPanel title="Improvements">
              <ListOrEmpty items={report.improvements} />
            </AdminPanel>
          </div>

          {report.priorityImprovements.length ? (
            <AdminPanel title="Priority improvements">
              <ul className="space-y-4">
                {report.priorityImprovements.map((item) => (
                  <li key={item.id} className="rounded-xl border border-border p-4">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <PriorityBadge priority={item.priority} />
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </AdminPanel>
          ) : null}

          {sections.length ? (
            <AdminPanel title="Questionnaire answers">
              <div className="space-y-6">
                {sections.map(([sectionId, answers]) => (
                  <div key={sectionId}>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {sectionLabel(sectionId)}
                    </h3>
                    <dl className="space-y-4">
                      {Object.entries(answers).map(([questionId, value]) => (
                        <div key={questionId} className="space-y-1">
                          <dt className="text-xs text-muted-foreground">
                            {questionLabel(sectionId, questionId)}
                          </dt>
                          <dd className="text-sm leading-relaxed">
                            {formatAnswer(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </AdminPanel>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start break-all">
          <AdminPanel title="Contact">
            <dl className="space-y-3">
              <AdminFact label="Email">
                {data.contactEmail ? (
                 
                    <a
                      href={`mailto:${data.contactEmail}`}
                      className="text-primary underline-offset-4 hover:underline "
                    >
                      {data.contactEmail}
                    </a>
           
                ) : (
                  "—"
                )}
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
              <AdminFact label="Resume">
                <ExternalOrDash href={data.resumeLink}>
                  {data.resumeLink ? "Open resume" : "—"}
                </ExternalOrDash>
              </AdminFact>
              <AdminFact label="Created">
                {formatAdminDate(data.createdAt)}
              </AdminFact>
              <AdminFact label="Updated">
                {formatAdminDate(data.updatedAt)}
              </AdminFact>
              <AdminFact label="ID">
       
                <Link href={`/assessment/${data.id}`} 
                target="_blank"
                className="text-primary underline-offset-4 hover:underline">
                  View Assessment
                </Link>
                </AdminFact>
              </dl>
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}

function ListOrEmpty({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">None listed.</p>;
  }
  return (
    <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: "high" | "medium" | "easy";
}) {
  const styles =
    priority === "high"
      ? "bg-red-500/10 text-red-700 dark:text-red-400"
      : priority === "medium"
        ? "bg-amber-500/10 text-amber-800 dark:text-amber-400"
        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  const label =
    priority === "high"
      ? "High"
      : priority === "medium"
        ? "Medium"
        : "Easy win";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        styles
      )}
    >
      {label}
    </span>
  );
}
