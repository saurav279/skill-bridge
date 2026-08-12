"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail } from "lucide-react";
import { SubscribeEmailButton } from "@/components/shared/email-preference-buttons";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";

export function SubscribeView() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";
  const [done, setDone] = useState(false);

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-elevated sm:p-10">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <BrandLogo height={36} priority />
            </div>

            {!done ? (
              <>
                <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="size-6" aria-hidden />
                </div>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                  Subscribe to emails?
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {email ? (
                    <>
                      We’ll send Skill Bridge updates to{" "}
                      <span className="font-medium text-foreground">
                        {email}
                      </span>
                      .
                    </>
                  ) : (
                    <>
                      Add an email with{" "}
                      <span className="font-mono text-xs text-foreground">
                        ?email=you@example.com
                      </span>
                      .
                    </>
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CheckCircle2 className="size-6" aria-hidden />
                </div>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight">
                  You’re subscribed
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {email ? (
                    <>
                      <span className="font-medium text-foreground">{email}</span>{" "}
                      will receive Skill Bridge emails again.
                    </>
                  ) : (
                    <>You’re back on the Skill Bridge email list.</>
                  )}
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {!done ? (
              <SubscribeEmailButton
                email={email}
                className="w-full"
                onSuccess={() => setDone(true)}
              />
            ) : null}
            <Button
              variant={done ? "default" : "ghost"}
              className="h-11 w-full rounded-full font-semibold"
              render={<Link href="/" />}
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
