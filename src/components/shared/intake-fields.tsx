import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/shared/phone-input";
import { cn } from "@/lib/utils";
import { VISA_OPTIONS } from "@/lib/intake-details";
import type { LivesInUk, UkVisaOption } from "@/types/consultation";

export function RequiredMark() {
  return (
    <span className="ml-0.5 text-primary" aria-hidden>
      *
    </span>
  );
}

type IntakeProfileFieldsProps = {
  phone: string;
  livesInUk: LivesInUk | "";
  ukVisa: UkVisaOption | "";
  ukVisaOther: string;
  disabled?: boolean;
  onPhone: (value: string) => void;
  onLivesInUk: (value: LivesInUk) => void;
  onUkVisa: (value: UkVisaOption) => void;
  onUkVisaOther: (value: string) => void;
};

export function IntakeProfileFields({
  phone,
  livesInUk,
  ukVisa,
  ukVisaOther,
  disabled,
  onPhone,
  onLivesInUk,
  onUkVisa,
  onUkVisaOther,
}: IntakeProfileFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="intake-phone">
          Phone
          <RequiredMark />
        </Label>
        <PhoneInputField
          id="intake-phone"
          value={phone}
          onChange={onPhone}
          disabled={disabled}
          required
        />
      </div>

      <fieldset className="space-y-3" disabled={disabled}>
        <legend className="text-sm font-medium">
          Do you live in the UK?
          <RequiredMark />
        </legend>
        <div className="flex flex-wrap gap-2">
          {(["yes", "no"] as const).map((option) => {
            const selected = livesInUk === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => onLivesInUk(option)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                {option === "yes" ? "Yes" : "No"}
              </button>
            );
          })}
        </div>
      </fieldset>

      {livesInUk === "yes" ? (
        <fieldset className="space-y-3" disabled={disabled}>
          <legend className="text-sm font-medium">
            Which visa are you on?
            <RequiredMark />
          </legend>
          <div className="flex flex-wrap gap-2">
            {VISA_OPTIONS.map((option) => {
              const selected = ukVisa === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => onUkVisa(option.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {ukVisa === "other" ? (
            <div className="space-y-2">
              <Label htmlFor="intake-visa-other" className="sr-only">
                Specify your visa
              </Label>
              <Input
                id="intake-visa-other"
                name="ukVisaOther"
                type="text"
                autoFocus
                placeholder="Please specify your visa"
                value={ukVisaOther}
                onChange={(e) => onUkVisaOther(e.target.value)}
                required
                disabled={disabled}
                className="h-11 rounded-xl"
              />
            </div>
          ) : null}
        </fieldset>
      ) : null}
    </>
  );
}
