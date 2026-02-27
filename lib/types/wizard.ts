export interface UserProfile {
  state: "WA" | "OR" | null;
  isVeteran: boolean;
  isDisabledVeteran: boolean;
  isMinority: boolean;
  isWomanOwned: boolean;
  businessName: string;
  tradeExperience: string;
}

export interface StepProgress {
  visited: boolean;
  completedChecklist: string[];
}

export interface WizardProgress {
  [phaseId: string]: {
    [stepId: string]: StepProgress;
  };
}

export interface UserState {
  profile: UserProfile;
  progress: WizardProgress;
  currentPhase: string;
  currentStep: string;
  startedAt: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  state: null,
  isVeteran: false,
  isDisabledVeteran: false,
  isMinority: false,
  isWomanOwned: false,
  businessName: "",
  tradeExperience: "",
};

export const DEFAULT_STATE: UserState = {
  profile: DEFAULT_PROFILE,
  progress: {},
  currentPhase: "business-formation",
  currentStep: "choose-structure",
  startedAt: "",
};
