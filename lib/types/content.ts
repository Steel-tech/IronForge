export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: Step[];
}

export interface Step {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  estimatedCost: CostRange;
  checklist: ChecklistItem[];
  resources: Resource[];
  tips: string[];
  warnings: string[];
  stateSpecific: boolean;
  aiContext: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  link?: string;
}

export interface Resource {
  title: string;
  url: string;
  description: string;
  type: "form" | "website" | "guide" | "phone" | "office";
}

export interface CostRange {
  min: number;
  max: number;
  notes: string;
}
