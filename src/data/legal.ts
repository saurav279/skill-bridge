import { company } from "@/data/company";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const privacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: "12 August 2026",
  intro: `This Privacy Policy explains how ${company.name} (“we”, “us”, or “our”) collects, uses, and protects personal information when you use ${company.website}, complete our assessment questionnaire, book a consultation, or otherwise interact with our Global Talent Visa consultancy services.`,
  sections: [
    {
      id: "who-we-are",
      title: "1. Who we are",
      paragraphs: [
        `${company.name} is a Global Talent Visa consultancy based in ${company.address}. We provide strategy, evidence planning, and Stage 1 endorsement preparation support. We are not an immigration agency and do not provide regulated immigration advice unless separately stated.`,
        `For privacy questions, contact us at ${company.email} or ${company.phone}.`,
      ],
    },
    {
      id: "information-we-collect",
      title: "2. Information we collect",
      paragraphs: [
        "We collect information you provide directly and information generated through your use of our website and services.",
      ],
      bullets: [
        "Identity and contact details — name, email address, phone number, and company or professional affiliation.",
        "Assessment and consultation information — questionnaire answers, career history summaries, evidence descriptions, and documents you upload (such as a resume).",
        "Payment and billing details — processed by our payment provider; we do not store full card numbers on our servers.",
        "Communications — messages sent through our contact forms, email, or booking tools.",
        "Technical data — IP address, browser type, device information, and approximate location derived from standard web logs and analytics.",
      ],
    },
    {
      id: "how-we-use",
      title: "3. How we use your information",
      paragraphs: [
        "We use personal information only where we have a lawful basis, including to perform a contract with you, pursue our legitimate interests, or comply with legal obligations.",
      ],
      bullets: [
        "To deliver consultancy services, assessments, packages, and discovery calls you request.",
        "To personalise recommendations and communicate about your engagement.",
        "To send service updates and, where permitted, marketing emails you can unsubscribe from at any time.",
        "To improve our website, products, and internal processes.",
        "To detect, prevent, and respond to fraud, abuse, or security incidents.",
        "To comply with applicable laws, regulations, and professional obligations.",
      ],
    },
    {
      id: "sharing",
      title: "4. How we share information",
      paragraphs: [
        "We do not sell your personal information. We may share it with trusted processors who help us operate the business, under appropriate contractual safeguards.",
      ],
      bullets: [
        "Cloud hosting, email delivery, analytics, and customer-support tools.",
        "Payment processors for checkout and invoicing.",
        "Professional advisers (for example accountants or solicitors) where reasonably required.",
        "Authorities or third parties when required by law or to protect our rights and users’ safety.",
      ],
    },
    {
      id: "international",
      title: "5. International transfers",
      paragraphs: [
        "Your information may be processed in the United Kingdom and in other countries where our service providers operate. Where we transfer personal data outside the UK/EEA, we use appropriate safeguards such as standard contractual clauses or equivalent mechanisms.",
      ],
    },
    {
      id: "retention",
      title: "6. Data retention",
      paragraphs: [
        "We keep personal information only as long as needed for the purposes described in this policy, including to meet legal, accounting, or reporting requirements. Assessment materials and engagement records are typically retained for a limited period after your matter closes, then deleted or anonymised unless a longer retention period is required.",
      ],
    },
    {
      id: "security",
      title: "7. Security",
      paragraphs: [
        "We apply technical and organisational measures designed to protect personal information against unauthorised access, loss, or alteration. No method of transmission or storage is completely secure; if we become aware of a breach affecting your data, we will notify you and regulators where required by law.",
      ],
    },
    {
      id: "your-rights",
      title: "8. Your rights",
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data, to object to certain processing, and to data portability. You may also lodge a complaint with your local data protection authority.",
        `To exercise these rights, email ${company.email} with the subject line “Privacy request”. We may need to verify your identity before responding.`,
      ],
    },
    {
      id: "cookies",
      title: "9. Cookies and similar technologies",
      paragraphs: [
        "We use essential cookies to run the site and may use analytics cookies to understand how visitors use our pages. You can control non-essential cookies through your browser settings. Blocking some cookies may affect site functionality.",
      ],
    },
    {
      id: "children",
      title: "10. Children’s privacy",
      paragraphs: [
        "Our services are intended for adults seeking professional visa-related consultancy. We do not knowingly collect personal information from children under 16. If you believe we have collected such information, contact us and we will take appropriate steps to delete it.",
      ],
    },
    {
      id: "changes",
      title: "11. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of our services after an update constitutes acceptance of the revised policy where permitted by law.",
      ],
    },
    {
      id: "contact",
      title: "12. Contact",
      paragraphs: [
        `Questions about this Privacy Policy or our data practices can be sent to ${company.email}, or by post to ${company.name}, ${company.address}.`,
      ],
    },
  ] satisfies LegalSection[],
};

export const termsOfUse = {
  title: "Terms of Use",
  lastUpdated: "12 August 2026",
  intro: `These Terms of Use (“Terms”) govern your access to and use of the ${company.name} website and related online services. By using our site or purchasing a package, you agree to these Terms. If you do not agree, do not use our services.`,
  sections: [
    {
      id: "about-services",
      title: "1. About our services",
      paragraphs: [
        `${company.name} provides Global Talent Visa consultancy, including eligibility assessment support, evidence strategy, package-based coaching, and related educational resources. We are a consultancy — not an immigration agency, law firm, or Home Office decision-maker.`,
        "Nothing on this website constitutes immigration advice, legal advice, or a guarantee of endorsement or visa approval. Outcomes depend on your individual profile, evidence quality, endorsing body criteria, and decisions by third parties beyond our control.",
      ],
    },
    {
      id: "eligibility",
      title: "2. Eligibility to use the site",
      paragraphs: [
        "You must be at least 18 years old and capable of entering a binding agreement to use our paid services. You agree to provide accurate information and to keep your account credentials (if any) confidential.",
      ],
    },
    {
      id: "accounts",
      title: "3. Accounts and client workspace",
      paragraphs: [
        "Some features may require registration. You are responsible for activity under your account. Notify us promptly at our support email if you suspect unauthorised access. We may suspend or close accounts that violate these Terms or pose a security risk.",
      ],
    },
    {
      id: "packages",
      title: "4. Packages, payments, and refunds",
      paragraphs: [
        "Package descriptions, pricing, and inclusions are shown on our website and may change. Purchases are subject to the specific package terms presented at checkout.",
        "Fees are generally payable in advance through our payment provider. Unless a package expressly states otherwise, fees are non-refundable once work has begun or digital deliverables have been provided. If you believe a billing error occurred, contact us within 14 days of the charge.",
      ],
    },
    {
      id: "your-responsibilities",
      title: "5. Your responsibilities",
      paragraphs: [
        "You agree to use our services lawfully and in good faith.",
      ],
      bullets: [
        "Provide truthful, complete information relevant to your engagement.",
        "Do not upload malware, infringing content, or materials you are not entitled to share.",
        "Do not misuse assessments, templates, or deliverables for fraudulent applications.",
        "Do not attempt to reverse engineer, scrape, or disrupt the website.",
        "Comply with all applicable laws, including data protection and immigration rules that apply to you.",
      ],
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual property",
      paragraphs: [
        `All website content, branding, questionnaires, frameworks, and materials created by ${company.name} remain our intellectual property or that of our licensors. We grant you a limited, non-exclusive, non-transferable licence to use deliverables solely for your personal Global Talent Visa preparation.`,
        "You may not resell, republish, or commercially exploit our materials without prior written consent.",
      ],
    },
    {
      id: "third-parties",
      title: "7. Third-party services",
      paragraphs: [
        "Our site may link to third-party tools such as calendaring, payments, or cloud storage. Those services are governed by their own terms and privacy policies. We are not responsible for third-party content or practices.",
      ],
    },
    {
      id: "disclaimers",
      title: "8. Disclaimers",
      paragraphs: [
        'THE WEBSITE AND SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE FULLEST EXTENT PERMITTED BY LAW.',
        "We do not warrant that the site will be uninterrupted, error-free, or free of harmful components, or that any particular endorsement or visa outcome will be achieved.",
      ],
    },
    {
      id: "liability",
      title: "9. Limitation of liability",
      paragraphs: [
        `To the maximum extent permitted by law, ${company.name} and its directors, employees, and contractors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, goodwill, or opportunity arising from your use of the site or services.`,
        "Our aggregate liability arising out of or relating to these Terms or any package purchase shall not exceed the amounts you paid to us for the specific service giving rise to the claim in the twelve (12) months preceding the event.",
      ],
    },
    {
      id: "indemnity",
      title: "10. Indemnity",
      paragraphs: [
        `You agree to indemnify and hold harmless ${company.name} from claims, losses, and expenses (including reasonable legal fees) arising from your misuse of the services, your violation of these Terms, or your infringement of any third-party rights.`,
      ],
    },
    {
      id: "termination",
      title: "11. Suspension and termination",
      paragraphs: [
        "We may suspend or terminate access to the site or an engagement if you breach these Terms, fail to pay fees when due, or if continuing the relationship would be unlawful or unsafe. Provisions that by nature should survive termination (including intellectual property, disclaimers, and liability limits) will survive.",
      ],
    },
    {
      id: "governing-law",
      title: "12. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of England and Wales. Courts in England and Wales shall have exclusive jurisdiction, except that we may seek injunctive relief in any jurisdiction to protect our intellectual property or confidential information.",
      ],
    },
    {
      id: "changes-terms",
      title: "13. Changes to these Terms",
      paragraphs: [
        "We may update these Terms periodically. Material changes will be reflected by updating the “Last updated” date. Continued use of the site after changes take effect constitutes acceptance of the revised Terms.",
      ],
    },
    {
      id: "contact-terms",
      title: "14. Contact",
      paragraphs: [
        `For questions about these Terms, contact ${company.email} or write to ${company.name}, ${company.address}.`,
      ],
    },
  ] satisfies LegalSection[],
};
