"use client";

import { useEffect } from "react";
import { packages } from "@/data/packages";

export function ClearBookingDraft() {
  useEffect(() => {
    for (const pkg of packages) {
      sessionStorage.removeItem(`skill-bridge:booking:${pkg.slug}`);
    }
  }, []);

  return null;
}
