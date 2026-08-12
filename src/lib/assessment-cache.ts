/**
 * Assessment progress cache (per endorsement route).
 *
 * Shape:
 * {
 *   version: 1,
 *   lastRouteId: "digital-technology" | null,
 *   routes: {
 *     [routeId]: { step, answers, updatedAt }
 *   }
 * }
 *
 * - Refresh restores `lastRouteId` + that route’s answers/step.
 * - Choosing a route from the picker overwrites that route’s slot.
 * - “Remove Assessment cache” clears all routes at once.
 * - File uploads cannot be restored from localStorage (user re-selects resume).
 */

export type AssessmentCachedAnswers = Record<string, unknown>;

export type AssessmentRouteCache = {
  step: number;
  answers: AssessmentCachedAnswers;
  updatedAt: string;
};

export type AssessmentCacheStore = {
  version: 1;
  lastRouteId: string | null;
  routes: Record<string, AssessmentRouteCache>;
};

export const ASSESSMENT_CACHE_KEY = "skill-bridge.assessment";

const EMPTY_STORE: AssessmentCacheStore = {
  version: 1,
  lastRouteId: null,
  routes: {},
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readAssessmentCache(): AssessmentCacheStore {
  if (!canUseStorage()) return { ...EMPTY_STORE, routes: {} };

  try {
    const raw = window.localStorage.getItem(ASSESSMENT_CACHE_KEY);
    if (!raw) return { ...EMPTY_STORE, routes: {} };

    const parsed = JSON.parse(raw) as AssessmentCacheStore;
    if (parsed?.version !== 1 || typeof parsed.routes !== "object" || !parsed.routes) {
      return { ...EMPTY_STORE, routes: {} };
    }

    return {
      version: 1,
      lastRouteId:
        typeof parsed.lastRouteId === "string" ? parsed.lastRouteId : null,
      routes: parsed.routes,
    };
  } catch {
    return { ...EMPTY_STORE, routes: {} };
  }
}

function writeAssessmentCache(store: AssessmentCacheStore) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(ASSESSMENT_CACHE_KEY, JSON.stringify(store));
  } catch {
    // Quota / private mode — ignore
  }
}

export function hasAnyAssessmentCache(store = readAssessmentCache()) {
  return Object.keys(store.routes).length > 0;
}

/** Strip File objects — localStorage cannot hold them. */
export function serializeAnswersForCache(
  answers: AssessmentCachedAnswers
): AssessmentCachedAnswers {
  const out: AssessmentCachedAnswers = {};
  for (const [key, value] of Object.entries(answers)) {
    if (typeof File !== "undefined" && value instanceof File) {
      out[key] = {
        __cachedFile: true,
        name: value.name,
        size: value.size,
        type: value.type,
      };
      continue;
    }
    out[key] = value;
  }
  return out;
}

/** Drop file placeholders so the user re-uploads after refresh. */
export function deserializeAnswersFromCache(
  answers: AssessmentCachedAnswers
): AssessmentCachedAnswers {
  const out: AssessmentCachedAnswers = {};
  for (const [key, value] of Object.entries(answers)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      "__cachedFile" in value
    ) {
      continue;
    }
    out[key] = value;
  }
  return out;
}

export function saveRouteCache(
  routeId: string,
  data: { step: number; answers: AssessmentCachedAnswers }
) {
  const store = readAssessmentCache();
  store.lastRouteId = routeId;
  store.routes[routeId] = {
    step: data.step,
    answers: serializeAnswersForCache(data.answers),
    updatedAt: new Date().toISOString(),
  };
  writeAssessmentCache(store);
  return store;
}

export function setAssessmentLastRouteId(routeId: string | null) {
  const store = readAssessmentCache();
  store.lastRouteId = routeId;
  writeAssessmentCache(store);
  return store;
}

export function clearRouteCache(routeId: string) {
  const store = readAssessmentCache();
  delete store.routes[routeId];
  if (store.lastRouteId === routeId) store.lastRouteId = null;
  writeAssessmentCache(store);
  return store;
}

/** Clears cache for every route at once. */
export function clearAllAssessmentCache() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(ASSESSMENT_CACHE_KEY);
  } catch {
    // ignore
  }
}
