"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
  type CountryIso2,
  type ParsedCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";

const PREFERRED_ISO2: CountryIso2[] = [
  "gb",
  "in",
  "us",
  "ng",
  "ae",
  "pk",
  "bd",
  "ie",
  "au",
  "ca",
];

const ALL_COUNTRIES: ParsedCountry[] = defaultCountries.map(parseCountry);

function countryMatches(country: ParsedCountry, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const dial = `+${country.dialCode}`;
  const digits = q.replace(/^\+/, "");
  return (
    country.name.toLowerCase().includes(q) ||
    country.iso2.toLowerCase().includes(q) ||
    dial.includes(q) ||
    country.dialCode.includes(digits)
  );
}

type PhoneInputFieldProps = {
  id?: string;
  value: string;
  onChange: (e164: string) => void;
  disabled?: boolean;
  required?: boolean;
};

export function PhoneInputField({
  id = "intake-phone",
  value,
  onChange,
  disabled,
  required,
}: PhoneInputFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 320 });

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "gb",
      value,
      disableDialCodeAndPrefix: true,
      allowMaskOverflow: true,
      onChange: ({ phone }) => onChange(phone),
    });

  const filtered = useMemo(() => {
    const matched = ALL_COUNTRIES.filter((c) => countryMatches(c, query));
    if (query.trim()) return matched;

    const preferred = PREFERRED_ISO2.map((iso) =>
      ALL_COUNTRIES.find((c) => c.iso2 === iso)
    ).filter((c): c is ParsedCountry => Boolean(c));
    const preferredSet = new Set(preferred.map((c) => c.iso2));
    return [...preferred, ...matched.filter((c) => !preferredSet.has(c.iso2))];
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        left: rect.left,
        width: Math.max(rect.width, 300),
      });
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      const menu = document.getElementById("phone-country-menu");
      if (menu?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const id = window.setTimeout(() => searchRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function selectCountry(next: ParsedCountry) {
    setCountry(next.iso2, { focusOnInput: true });
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <div
        className={cn(
          "flex h-11 overflow-hidden rounded-xl border border-input bg-transparent transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <button
          type="button"
          disabled={disabled}
          aria-label="Select country code"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 border-r border-input bg-muted/30 px-2.5 text-sm hover:bg-muted/50"
        >
          <FlagImage iso2={country.iso2} size={20} />
          <span className="font-medium tabular-nums">+{country.dialCode}</span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        <input
          id={id}
          ref={inputRef}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required={required}
          disabled={disabled}
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder="7123456789"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-sm"
        />
      </div>

      {open
        ? createPortal(
            <div
              id="phone-country-menu"
              role="listbox"
              aria-label="Country codes"
              className="fixed z-[80] overflow-hidden rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-elevated"
              style={{
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
              }}
            >
              <div className="border-b border-border/70 p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search country or code"
                    className="h-10 w-full rounded-lg border border-input bg-transparent pr-3 pl-9 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                  />
                </div>
              </div>
              <ul className="max-h-64 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No countries match “{query.trim()}”
                  </li>
                ) : (
                  filtered.map((item, index) => {
                    const selected = item.iso2 === country.iso2;
                    const showDivider =
                      !query.trim() &&
                      index === PREFERRED_ISO2.length - 1 &&
                      filtered.length > PREFERRED_ISO2.length;
                    return (
                      <li key={item.iso2}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => selectCountry(item)}
                          className={cn(
                            "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-muted/70",
                            selected && "bg-primary/10 text-primary"
                          )}
                        >
                          <FlagImage iso2={item.iso2} size={20} />
                          <span className="min-w-0 flex-1 truncate">
                            {item.name}
                          </span>
                          <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
                            +{item.dialCode}
                          </span>
                        </button>
                        {showDivider ? (
                          <div
                            className="my-1 border-t border-border/70"
                            aria-hidden
                          />
                        ) : null}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
