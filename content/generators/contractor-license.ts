import type { Phase, Step } from "@/lib/types/content";
import type { StateData } from "../state-registry";

export function generateContractorLicense(state: StateData): Phase {
  const steps: Step[] = [];

  if (state.hasStateLicense) {
    steps.push({
      id: "state-license",
      title: `${state.name} Contractor License`,
      description: `${state.name} requires a state contractor license through ${state.licensingAgency}. ${state.licensingNotes}`,
      estimatedTime: "2-4 weeks",
      estimatedCost: { min: state.licensingFee.min, max: state.licensingFee.max, notes: `${state.name} contractor license fee` },
      checklist: [
        ...(state.examRequired ? [{ id: "pass-exam", label: "Study for and pass the contractor exam", description: `${state.name} requires passing a contractor exam before licensure`, required: true }] : []),
        ...(state.stateBondRequired ? [{ id: "obtain-bond", label: `Obtain surety bond (${state.stateBondAmount})`, description: "Required before license application", required: true }] : []),
        { id: "obtain-insurance", label: "Obtain general liability insurance", description: "Must have current GL insurance before application", required: true },
        { id: "submit-application", label: `Submit contractor license application to ${state.licensingAgency}`, description: "Include all required documentation", required: true, ...(state.licensingUrl ? { link: state.licensingUrl } : {}) },
        { id: "workers-comp", label: "Set up workers' compensation insurance", description: "Required before hiring employees", required: true },
      ],
      resources: [
        ...(state.licensingUrl ? [{ title: `${state.licensingAgency}`, url: state.licensingUrl, description: `Official licensing information for ${state.name}`, type: "guide" as const }] : []),
      ],
      tips: [
        state.examRequired ? "Study the relevant contractor reference manual for the exam" : `${state.name} does not require an exam — registration-based process`,
        "Get your bond and insurance lined up before applying",
        "Set calendar reminders for license renewal",
      ],
      warnings: [
        `Working without a required license in ${state.name} can result in significant fines`,
        "Keep your license current — lapsed licenses can delay your ability to bid",
      ],
      stateSpecific: true,
      aiContext: `${state.name} contractor licensing. ${state.licensingNotes} Fee: $${state.licensingFee.min}-$${state.licensingFee.max}. Exam required: ${state.examRequired}.`,
    });
  } else {
    steps.push({
      id: "local-licensing",
      title: `${state.name} Contractor Licensing (Local Control)`,
      description: `${state.name} does not have a state-level general contractor license. ${state.licensingNotes} You'll need to research and obtain licenses from each local jurisdiction where you plan to work.`,
      estimatedTime: "1-4 weeks (varies by jurisdiction)",
      estimatedCost: { min: 0, max: 500, notes: "Varies by local jurisdiction" },
      checklist: [
        { id: "identify-jurisdictions", label: "Identify all jurisdictions where you'll work", description: "Each city/county may have different licensing requirements", required: true },
        { id: "research-local", label: "Research local licensing requirements", description: "Contact local building departments for specific requirements", required: true },
        { id: "local-business-license", label: "Obtain local business licenses", description: "Most municipalities require a general business license", required: true },
        { id: "obtain-insurance", label: "Obtain general liability insurance", description: "Required by most jurisdictions and all GCs", required: true },
      ],
      resources: [],
      tips: [
        `${state.name} has no state-level contractor license — licensing is handled locally`,
        "Start with the jurisdiction where you'll do most of your work",
        "Some jurisdictions accept licenses from other municipalities — ask about reciprocity",
        "Join your local AGC or ABC chapter for help navigating local licensing",
      ],
      warnings: [
        "Working without required local licenses can result in stop-work orders and fines",
        "Each municipality has different requirements — don't assume one license covers everywhere",
      ],
      stateSpecific: true,
      aiContext: `${state.name} has no state-level general contractor license. ${state.licensingNotes} Local jurisdictions handle licensing.`,
    });
  }

  // Specialty classifications step
  steps.push({
    id: "specialty-trades",
    title: "Specialty Trade Considerations for Ironwork",
    description: `Regardless of state licensing, you must comply with OSHA standards for steel erection (29 CFR 1926 Subpart R). Understanding local building code adoption and structural steel requirements is essential for operating safely and legally in ${state.name}.`,
    estimatedTime: "1-2 hours research",
    estimatedCost: { min: 0, max: 0, notes: "No additional cost" },
    checklist: [
      { id: "osha-subpart-r", label: "Review OSHA Steel Erection standards (Subpart R)", description: "Federal requirements for structural steel erection apply everywhere", required: true },
      { id: "local-structural", label: "Check local structural work requirements", description: "Some jurisdictions require additional permits for structural steel", required: true },
      { id: "building-codes", label: `Understand building code adoption in ${state.name}`, description: "Most states adopt IBC — know the structural requirements", required: true },
    ],
    resources: [
      { title: "OSHA - Steel Erection Standards", url: "https://www.osha.gov/steel-erection", description: "Federal steel erection safety standards", type: "guide" },
    ],
    tips: [
      "OSHA Subpart R is your bible for steel erection safety — know it cold",
      "AISC certification for steel erection/fabrication can be a competitive advantage",
      `${state.uniqueNotes}`,
    ],
    warnings: [
      "OSHA fines for steel erection violations are severe — up to $161,323 per willful violation",
      "Fall protection requirements are strictly enforced on steel erection projects",
    ],
    stateSpecific: true,
    aiContext: `Ironwork specialty considerations in ${state.name}. OSHA Subpart R applies federally. ${state.uniqueNotes}`,
  });

  // Prevailing wage step
  const prevWageDesc = state.hasStatePrevailingWage
    ? `${state.name} has a state prevailing wage law administered by ${state.prevailingWageAgency}. State prevailing wage applies to public works projects over ${state.prevailingWageThreshold}. Federal Davis-Bacon also applies to federally funded projects over $2,000.`
    : `${state.name} does not have a state prevailing wage law. Only federal Davis-Bacon applies to federally funded projects over $2,000. This means private projects and state/local-funded projects have no prevailing wage requirements.`;

  steps.push({
    id: "prevailing-wage",
    title: `${state.name} Prevailing Wage`,
    description: prevWageDesc,
    estimatedTime: "1-2 hours to understand",
    estimatedCost: { min: 0, max: 0, notes: "No registration cost" },
    checklist: [
      ...(state.hasStatePrevailingWage ? [{ id: "state-prevailing", label: `Understand ${state.name} state prevailing wage requirements`, description: `Applies to public works over ${state.prevailingWageThreshold}`, required: true }] : []),
      { id: "davis-bacon", label: "Understand federal Davis-Bacon requirements", description: "Federal prevailing wages apply to federally funded projects over $2,000", required: true },
      { id: "certified-payroll", label: "Set up certified payroll reporting capability", description: "Required for all prevailing wage projects", required: true },
    ],
    resources: [
      ...(state.hasStatePrevailingWage && state.prevailingWageUrl ? [{ title: `${state.name} Prevailing Wage`, url: state.prevailingWageUrl, description: `${state.name} prevailing wage information`, type: "website" as const }] : []),
      { title: "US DOL - Davis-Bacon Wage Determinations", url: "https://sam.gov/content/wage-determinations", description: "Federal prevailing wage rates", type: "website" as const },
    ],
    tips: [
      state.hasStatePrevailingWage
        ? `${state.name} prevailing wage threshold is ${state.prevailingWageThreshold}`
        : `${state.name} has no state prevailing wage — only federal Davis-Bacon on federally funded projects`,
      "Prevailing wage ironwork jobs pay significantly more than private work",
      "Learn certified payroll early — it's required and audited on public projects",
    ],
    warnings: [
      "Davis-Bacon violations can result in debarment from federal contracting",
      "Keep meticulous time and payroll records for all prevailing wage projects",
    ],
    stateSpecific: true,
    aiContext: `${state.name} prevailing wage. ${state.hasStatePrevailingWage ? `State prevailing wage applies to public works >${state.prevailingWageThreshold}. Agency: ${state.prevailingWageAgency}.` : "No state prevailing wage."} Federal Davis-Bacon for federally funded >$2K.`,
  });

  return {
    id: "contractor-licensing",
    title: "Contractor Licensing",
    description: `Contractor licensing requirements for ${state.name}`,
    icon: "ClipboardCheck",
    steps,
  };
}
