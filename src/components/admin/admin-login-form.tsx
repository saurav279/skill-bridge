"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin, adminVerifyOtp } from "@/services/admin-api";

const OTP_LENGTH = 6;

export function AdminLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminLogin({ email: email.trim(), password });
      setOtp(Array(OTP_LENGTH).fill(""));
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(code: string) {
    if (code.length !== OTP_LENGTH || busy) return;
    setError(null);
    setBusy(true);
    try {
      await adminVerifyOtp({ email: email.trim(), otp: code });
      router.replace("/admin/assessments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  }

  function onOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    const code = next.join("");
    if (code.length === OTP_LENGTH) void submitOtp(code);
  }

  function onOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function onOtpPaste(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (!digits.length) return;
    const next = Array(OTP_LENGTH).fill("");
    digits.forEach((digit, i) => {
      next[i] = digit;
    });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
    if (digits.length === OTP_LENGTH) void submitOtp(next.join(""));
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[oklch(0.7_0.05_250_/_0.25)] blur-3xl dark:bg-[oklch(0.4_0.06_250_/_0.35)]" />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-elevated sm:p-10">
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              <BrandLogo height={36} priority />
            </div>
            <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
              Internal
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {step === "login" ? "Admin sign in" : "Enter your code"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "login"
                ? "Two-factor access to assessments, inbox, and purchases."
                : "A 6-digit code was emailed to the admin inbox. It expires in 10 minutes."}
            </p>
          </div>

          {step === "login" ? (
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@skillbridgeconsultants.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                className="h-11 w-full rounded-xl"
                disabled={busy}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Send code
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitOtp(otp.join(""));
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="otp-0">One-time code</Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={index === 0 ? "otp-0" : undefined}
                      ref={(node) => {
                        otpRefs.current[index] = node;
                      }}
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => onOtpChange(index, e.target.value)}
                      onKeyDown={(e) => onOtpKeyDown(index, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        onOtpPaste(e.clipboardData.getData("text"));
                      }}
                      className="h-12 w-11 rounded-xl border border-input bg-transparent text-center font-mono text-lg outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                className="h-11 w-full rounded-xl"
                disabled={busy || otp.join("").length !== OTP_LENGTH}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                Verify
              </Button>
              <button
                type="button"
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setStep("login");
                  setError(null);
                  setOtp(Array(OTP_LENGTH).fill(""));
                }}
              >
                Use a different account
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
