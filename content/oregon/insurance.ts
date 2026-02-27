import type { Phase } from "@/lib/types/content";

export const orInsurance: Phase = {
  id: "insurance",
  title: "Insurance - Oregon",
  description: "Oregon-specific insurance requirements",
  icon: "ShieldCheck",
  steps: [
    {
      id: "or-workers-comp",
      title: "Oregon Workers' Compensation",
      description:
        "Oregon allows you to choose between SAIF Corporation (state accident insurance fund) or private insurance carriers for workers' comp. Unlike Washington, you have options. Coverage is required if you have any employees. Sole proprietors and LLC members may be exempt, but coverage is available if desired.",
      estimatedTime: "1-2 weeks",
      estimatedCost: { min: 3000, max: 15000, notes: "Varies by payroll, classification, and carrier - ironwork rates are high" },
      checklist: [
        {
          id: "or-choose-carrier",
          label: "Choose workers' comp carrier (SAIF or private)",
          description: "Compare quotes from SAIF and private carriers - rates can vary significantly",
          required: true,
        },
        {
          id: "or-wc-policy",
          label: "Obtain workers' compensation policy",
          description: "Required before hiring any employees",
          required: true,
        },
        {
          id: "or-wcd-registration",
          label: "Register with Oregon Workers' Compensation Division",
          description: "File proof of coverage with WCD",
          required: true,
          link: "https://wcd.oregon.gov/employer/Pages/index.aspx",
        },
        {
          id: "or-ccb-insurance-filing",
          label: "File insurance certificate with CCB",
          description: "CCB requires proof of workers' comp on file",
          required: true,
        },
      ],
      resources: [
        {
          title: "SAIF Corporation",
          url: "https://www.saif.com/",
          description: "Oregon state workers' comp fund",
          type: "website",
        },
        {
          title: "Oregon WCD - Employer Information",
          url: "https://wcd.oregon.gov/employer/Pages/index.aspx",
          description: "Workers' Compensation Division employer resources",
          type: "guide",
        },
      ],
      tips: [
        "Get quotes from both SAIF and at least 2 private carriers - rates vary widely",
        "Safety programs can reduce your experience modification rate and premiums over time",
        "Oregon allows competitive shopping for workers' comp - use it to your advantage",
        "LLC members can elect to be covered or exempt - consider the trade-off carefully",
      ],
      warnings: [
        "Operating without workers' comp when required is a serious violation with heavy fines",
        "CCB license requires proof of workers' comp - no coverage means no license",
        "If you exempt yourself, you have NO workers' comp coverage for your own injuries on the job",
      ],
      stateSpecific: true,
      aiContext:
        "Oregon workers' comp: SAIF (state fund) or private carriers (competitive). Required for employees. Must file with CCB and WCD. LLC members can exempt. Ironwork rates among highest.",
    },
  ],
};
