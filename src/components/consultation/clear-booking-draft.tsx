"use client";

import { useEffect } from "react";
import { consultationPackageIds } from "@/data/consultation-packages";

export function ClearBookingDraft() {
  useEffect(() => {
    for (const id of consultationPackageIds) {
      sessionStorage.removeItem(`skill-bridge:booking:${id}`);
    }
  }, []);

  return null;
}
