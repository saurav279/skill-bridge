"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LivesInUk, UkVisaOption } from "@/types/consultation";

type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  liveInUk?: LivesInUk;
  currentVisa?: UkVisaOption;
  ukVisaOther?: string;
};

type UserStore = {
  personalInfo: PersonalInfo;
  setPersonalInfo: (data: Partial<PersonalInfo>) => void;
  clearPersonalInfo: () => void;
};

const emptyPersonalInfo: PersonalInfo = {
  name: "",
  email: "",
  phone: "",
  liveInUk: undefined,
  currentVisa: undefined,
  ukVisaOther: undefined,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      personalInfo: emptyPersonalInfo,

      setPersonalInfo: (data) =>
        set((state) => {
          const personalInfo = { ...state.personalInfo, ...data };
          if (
            personalInfo.name === state.personalInfo.name &&
            personalInfo.email === state.personalInfo.email &&
            personalInfo.phone === state.personalInfo.phone &&
            personalInfo.liveInUk === state.personalInfo.liveInUk &&
            personalInfo.currentVisa === state.personalInfo.currentVisa &&
            personalInfo.ukVisaOther === state.personalInfo.ukVisaOther
          ) {
            return state;
          }
          return { personalInfo };
        }),

      clearPersonalInfo: () => set({ personalInfo: emptyPersonalInfo }),
    }),
    {
      name: "skill-bridge-personal-info",
      partialize: (state) => ({ personalInfo: state.personalInfo }),
    }
  )
);

/** False until persist has rehydrated from localStorage (avoids SSR mismatch). */
export function useUserStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useUserStore.persist.hasHydrated());
    return unsub;
  }, []);

  return hydrated;
}
