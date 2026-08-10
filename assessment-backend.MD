# Assessment Backend Spec

Contract between the Skill Bridge Next.js frontend and the Node.js API (`NEXT_PUBLIC_API_URL`, default `http://localhost:3001`).

PDF generation is **not** handled by this backend. The frontend builds PDFs via Next.js (`POST /api/eligibility/:id/pdf`) using `GET /assessments/:id` data.

Enable CORS for `http://localhost:3000` (and production origin).

---

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/assessments` | Create assessment from questionnaire |
| `GET` | `/assessments/:id` | Full assessment report |
| `POST` | `/assessments/:id/email` | Email report to candidate |

Errors should return JSON:

```json
{ "error": "Human-readable message" }
```

Suggested status codes: `400` validation, `404` not found, `500` server error.

---

## Types

### Shared enums

```ts
type PriorityLevel = "high" | "medium" | "easy";
```

### Request — `POST /assessments`

```ts
/** Answer value shapes */
type FileMeta = { name: string; size: number; type: string };

/**
 * Empty / unanswered → []
 * checkbox → string[]
 * radio | chips (single) | text → string
 * file → FileMeta | []
 */
type AnswerValue = string | string[] | FileMeta | [];

/** Keys are always `{sectionId}_{questionId}` */
type AssessSectionAnswers = Record<string, AnswerValue>;

/**
 * Top-level keys:
 * - routeId: string
 * - one object per section (9 sections)
 */
type AssessPayload = {
  routeId: "digital-technology" | "academia" | "arts";
  [sectionId: string]: string | AssessSectionAnswers;
};
```

### Response — `POST /assessments` and `GET /assessments/:id`

Same body for create and get:

```ts
type ScoreBreakdownItem = {
  id: string;
  label: string;
  score: number; // 0–100
};

type PriorityImprovement = {
  id: string;
  priority: PriorityLevel;
  title: string;
  description: string;
};

type EligibilityAssessment = {
  id: string;
  routeId: string;
  summary: string;
  headline: string;
  breakdown: ScoreBreakdownItem[];
  strengths: string[];
  improvements: string[];
  confidenceScore: number; // 0–100
  priorityImprovements: PriorityImprovement[];
  overallRecommendation: string;
};
```

Frontend derives potential label, probability, and star rating from `confidenceScore`.

### Request — `POST /assessments/:id/email`

```ts
type EmailAssessmentBody = {
  email?: string;
};
```

### Response — `POST /assessments/:id/email`

```ts
type EmailAssessmentResponse = {
  message?: string;
};
```

---

## Routes & sections

Always send **9 section objects**. Section set depends on `routeId`.

| `routeId` | Sections (order) |
|-----------|------------------|
| `digital-technology` | `leadership`, `innovation`, `impact`, `recognition`, `publicProfile`, `evidence`, `recommendationLetters`, `futurePlans`, `personalDetails` |
| `academia` | `leadership`, `research`, `impact`, `recognition`, `publicProfile`, `evidence`, `recommendationLetters`, `futurePlans`, `personalDetails` |
| `arts` | `leadership`, `creativeWork`, `impact`, `recognition`, `publicProfile`, `evidence`, `recommendationLetters`, `futurePlans`, `personalDetails` |

Answer keys: `{sectionId}_{questionId}`  
Examples: `leadership_current_role`, `personalDetails_email`

---

## Question keys by section

### `leadership`
| Key | Type | Notes |
|-----|------|--------|
| `leadership_current_role` | `string[]` | max 2 |
| `leadership_team_management` | `string` | `Yes` / `No` |
| `leadership_team_size` | `string` | only if team_management = Yes; else `[]` |
| `leadership_responsibilities` | `string[]` | |

### `innovation` (digital-technology)
| Key | Type |
|-----|------|
| `innovation_products` | `string[]` |
| `innovation_public_work` | `string` |
| `innovation_platforms` | `string[]` (if public_work = Yes; else `[]`) |

### `research` (academia)
| Key | Type |
|-----|------|
| `research_research_outputs` | `string[]` |
| `research_research_field` | `string` |
| `research_peer_review` | `string` |

### `creativeWork` (arts)
| Key | Type |
|-----|------|
| `creativeWork_creative_medium` | `string[]` |
| `creativeWork_exhibitions` | `string` |
| `creativeWork_creative_platforms` | `string[]` (if exhibitions = Yes; else `[]`) |

### `impact`
| Key | Type |
|-----|------|
| `impact_impact_type` | `string[]` |
| `impact_users` | `string` |

### `recognition`
| Key | Type |
|-----|------|
| `recognition_recognition` | `string[]` |

### `publicProfile`
| Key | Type |
|-----|------|
| `publicProfile_profiles` | `string[]` |

### `evidence`
| Key | Type |
|-----|------|
| `evidence_evidence_available` | `string[]` |

### `recommendationLetters`
| Key | Type |
|-----|------|
| `recommendationLetters_recommendation` | `string` |
| `recommendationLetters_recommenders` | `string[]` |

### `futurePlans`
| Key | Type |
|-----|------|
| `futurePlans_goal` | `string[]` |
| `futurePlans_timeline` | `string` |

### `personalDetails`
| Key | Type |
|-----|------|
| `personalDetails_name` | `string` |
| `personalDetails_email` | `string` |
| `personalDetails_resume` | `FileMeta` or `[]` |

Use `personalDetails_name` / `personalDetails_email` for candidate contact when emailing.

---

## Example — create request

`POST /assessments`  
`Content-Type: application/json`

```json
{
  "routeId": "digital-technology",
  "leadership": {
    "leadership_current_role": ["Senior Engineer"],
    "leadership_team_management": "Yes",
    "leadership_team_size": "6-10",
    "leadership_responsibilities": ["Hiring", "Architecture"]
  },
  "innovation": {
    "innovation_products": ["SaaS", "AI Product"],
    "innovation_public_work": "Yes",
    "innovation_platforms": ["GitHub", "Website"]
  },
  "impact": {
    "impact_impact_type": ["User Growth"],
    "impact_users": "10k-100k"
  },
  "recognition": {
    "recognition_recognition": ["Conference Speaker"]
  },
  "publicProfile": {
    "publicProfile_profiles": ["LinkedIn", "GitHub"]
  },
  "evidence": {
    "evidence_evidence_available": ["Recommendation Letters", "GitHub Repository"]
  },
  "recommendationLetters": {
    "recommendationLetters_recommendation": "Yes",
    "recommendationLetters_recommenders": ["CTO", "Industry Expert"]
  },
  "futurePlans": {
    "futurePlans_goal": ["Career Growth"],
    "futurePlans_timeline": "Within 6 months"
  },
  "personalDetails": {
    "personalDetails_name": "Alex Rivera",
    "personalDetails_email": "alex@example.com",
    "personalDetails_resume": {
      "name": "alex-resume.pdf",
      "size": 245760,
      "type": "application/pdf"
    }
  }
}
```

---

## Example — create / get response

`POST /assessments` and `GET /assessments/:id` return the same shape (`201`/`200`).

```json
{
  "id": "ea_01KZH2BW29V7Q80KJHAWJR5WY2",
  "routeId": "digital-technology",
  "summary": "Candidate's digital-technology profile shows a confidence score of 72/100 with moderate endorsement potential based on leadership, impact, recognition, and evidence signals.",
  "headline": "Your profile demonstrates promising digital technology achievements.",
  "breakdown": [
    { "id": "leadership", "label": "Leadership", "score": 78 },
    { "id": "innovation", "label": "Innovation", "score": 74 },
    { "id": "impact", "label": "Impact", "score": 58 },
    { "id": "recognition", "label": "Recognition", "score": 45 },
    { "id": "publicProfile", "label": "Public Profile", "score": 70 },
    { "id": "recommendationLetters", "label": "Recommendation Letters", "score": 55 },
    { "id": "futurePlans", "label": "Future Plans", "score": 80 }
  ],
  "strengths": [
    "Candidate's leadership record shows credible ownership and management signals that reviewers can evaluate.",
    "Innovation signals stand out through products, research outputs, or creative work with public visibility.",
    "Your public profile footprint is comparatively strong and supports independent verification."
  ],
  "improvements": [
    "Strengthen recommendation letters from senior independent experts.",
    "Add clearer impact metrics tied to your work.",
    "Align public profiles with your application narrative."
  ],
  "confidenceScore": 72,
  "priorityImprovements": [
    {
      "id": "letters",
      "title": "Strengthen recommendation letters",
      "priority": "high",
      "description": "Prioritise two to three letters from senior independent experts who can quantify your leadership and impact with specific outcomes, timelines, and comparisons to peers in your field."
    },
    {
      "id": "recognition",
      "title": "Build independent public recognition",
      "priority": "medium",
      "description": "Increase third-party visibility through speaking, awards, press, or peer invitations so reviewers can verify your standing beyond self-reported achievements and employer endorsements."
    },
    {
      "id": "linkedin",
      "title": "Align and polish public profiles",
      "priority": "easy",
      "description": "Make LinkedIn, portfolio, and personal site consistent with your application narrative, highlighting measurable impact, leadership scope, and evidence links reviewers can check quickly."
    }
  ],
  "overallRecommendation": "You are likely 6–12 months away from a competitive endorsement."
}
```

Frontend redirects to `/eligibility/{id}` using `id`.

### Radar / breakdown ids

Any subset is fine. Common ids:

`leadership` · `innovation` · `impact` · `recognition` · `publicProfile` · `evidence` · `recommendationLetters` · `futurePlans`

---

## Example — email

`POST /assessments/:id/email`

```json
{ "email": "alex@example.com" }
```

```json
{ "message": "Assessment email queued." }
```

---

## Out of scope (frontend)

| Concern | Owner |
|---------|--------|
| PDF download | Next.js `POST /api/eligibility/:id/pdf` (uses `GET /assessments/:id`) |
| Questionnaire UI / scoring UX | Frontend |
| Assessment scoring / AI / id generation | **Backend** |

Source of truth for TypeScript types in the frontend: `src/types/eligibility-assessment.ts`.
