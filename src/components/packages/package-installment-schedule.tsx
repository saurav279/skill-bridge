import type { PackageInstallmentPlan } from "@/types";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionTitle } from "@/components/shared/section-title";
import { formatPackagePrice } from "@/lib/format-package-price";
import { cn } from "@/lib/utils";

export function PackageInstallmentSchedule({
  plan,
  packageName,
}: {
  plan: PackageInstallmentPlan;
  packageName: string;
}) {
  const total = plan.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section
      id="payment-path"
      className="scroll-mt-28 border-t border-border/70 py-20 md:py-28"
    >
      <div className="container-page">
        <FadeIn>
          <SectionTitle
            eyebrow="Payment path"
            title={plan.label}
            description={`When each ${packageName} payment is due, how much it is, and what that payment unlocks.`}
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3.5 sm:px-6">Due</th>
                    <th className="px-5 py-3.5 sm:px-6">Amount</th>
                    <th className="px-5 py-3.5 sm:px-6">You get</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.payments.map((payment, index) => (
                    <tr
                      key={`${payment.due}-${payment.amount}`}
                      className={cn(
                        "border-b border-border/60 last:border-0",
                        index === 0 && "bg-primary/[0.03]"
                      )}
                    >
                      <td className="whitespace-nowrap px-5 py-4 align-top sm:px-6">
                        <p className="font-medium text-foreground">
                          {index === 0
                            ? "First payment"
                            : `Payment ${index + 1}`}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {payment.due}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 align-top tabular-nums sm:px-6">
                        <p className="font-semibold text-foreground">
                          {formatPackagePrice(payment.amount, plan.currency)}
                        </p>
                      </td>
                      <td className="px-5 py-4 align-top leading-relaxed text-muted-foreground sm:px-6">
                        {payment.achievement}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border/70 bg-muted/30">
                    <td className="px-5 py-3.5 text-sm font-medium sm:px-6">
                      Total
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold tabular-nums sm:px-6">
                      {formatPackagePrice(total, plan.currency)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground sm:px-6">
                      {plan.payments.length} payments
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
