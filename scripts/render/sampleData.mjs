/**
 * Stock ResumeData used for preview rendering. Same shape as the main
 * app's canonical `ResumeData` (see apps/web/src/domains/resume/schema.ts).
 * Kept intentionally realistic — no "Lorem ipsum" — so previews read
 * like the artifact the template actually produces.
 */
export const stockResume = {
  fullName: "Sarah Aldridge",
  headline: "Product Designer · Systems + typography",
  email: "sarah.aldridge@example.com",
  phone: "+1 (415) 555-0129",
  location: "Brooklyn, NY",
  summary:
    "Product designer with nine years across health and finance. Ships design systems that survive re-orgs, and writes down the tradeoffs so the next team doesn't relearn them.",
  experience: [
    {
      title: "Staff Product Designer",
      company: "Fielderly",
      location: "Remote",
      startDate: "Jan 2024",
      endDate: "Present",
      bullets: [
        "Rebuilt the shared design system across four product surfaces, cutting time-to-first-render on new screens from days to hours.",
        "Led the shift from bespoke tokens to a two-theme system now consumed by 26 apps.",
        "Wrote and shipped the internal docs that finally got engineering to adopt spacing tokens.",
      ],
    },
    {
      title: "Senior Product Designer",
      company: "Nurture Health",
      location: "New York, NY",
      startDate: "Apr 2020",
      endDate: "Dec 2023",
      bullets: [
        "Owned the patient-onboarding flow end-to-end; A/B tests lifted completion by 34%.",
        "Founded the design-ops chapter, hiring the first two ops designers.",
      ],
    },
    {
      title: "Product Designer",
      company: "Ledgerly",
      location: "San Francisco, CA",
      startDate: "Aug 2017",
      endDate: "Mar 2020",
      bullets: [
        "Second designer at a Series B fintech. Shipped the mobile budgeting app that took the company to 1M users.",
      ],
    },
  ],
  education: [
    {
      institution: "Rhode Island School of Design",
      degree: "BFA",
      field: "Graphic Design",
      startYear: "2013",
      endYear: "2017",
    },
  ],
  skills: [
    "Design systems",
    "Figma",
    "React",
    "Typography",
    "Prototyping",
    "Design ops",
    "Cross-functional facilitation",
  ],
};
