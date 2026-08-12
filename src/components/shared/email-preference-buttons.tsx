"use client";

import { useState } from "react";
import { Loader2, Mail, MailX } from "lucide-react";
import { subscribeEmail, unsubscribeEmail } from "@/api/useEmail";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type EmailActionButtonProps = {
  email: string;
  className?: string;
  onSuccess?: (action: "subscribe" | "unsubscribe") => void;
};

export function UnsubscribeEmailButton({
  email,
  className,
  onSuccess,
}: EmailActionButtonProps) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    const trimmed = email.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    const { success, data, error } = await unsubscribeEmail(trimmed);
    setBusy(false);

    if (!success || !data) {
      toast.error("Unsubscribe failed", error ?? "Please try again.");
      return;
    }

    toast.success("Unsubscribed", data.message);
    onSuccess?.("unsubscribe");
  }

  return (
    <Button
      type="button"
      className={cn("h-11 rounded-full font-semibold", className)}
      disabled={!email.trim() || busy}
      onClick={() => void onClick()}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <MailX className="size-4" />
      )}
      Unsubscribe
    </Button>
  );
}

export function SubscribeEmailButton({
  email,
  className,
  onSuccess,
}: EmailActionButtonProps) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    const trimmed = email.trim();
    if (!trimmed || busy) return;

    setBusy(true);
    const { success, data, error } = await subscribeEmail(trimmed);
    setBusy(false);

    if (!success || !data) {
      toast.error("Subscribe failed", error ?? "Please try again.");
      return;
    }

    toast.success("Subscribed", data.message);
    onSuccess?.("subscribe");
  }

  return (
    <Button
      type="button"
      className={cn("h-11 rounded-full font-semibold", className)}
      disabled={!email.trim() || busy}
      onClick={() => void onClick()}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Mail className="size-4" />
      )}
      Subscribe
    </Button>
  );
}
