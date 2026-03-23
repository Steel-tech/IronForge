import { cn } from "@/lib/utils";

interface IBeamIconProps {
  className?: string;
}

/**
 * Structural steel I-beam (wide-flange) cross-section icon.
 * Replaces the Zap lightning bolt as the IronForge brand icon.
 */
export function IBeamIcon({ className }: IBeamIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", className)}
    >
      {/* Top flange */}
      <line x1="4" y1="3" x2="20" y2="3" />
      {/* Bottom flange */}
      <line x1="4" y1="21" x2="20" y2="21" />
      {/* Web (vertical) */}
      <line x1="12" y1="3" x2="12" y2="21" />
      {/* Top flange thickness */}
      <line x1="4" y1="5" x2="20" y2="5" />
      {/* Bottom flange thickness */}
      <line x1="4" y1="19" x2="20" y2="19" />
      {/* Flange-to-web fillets (left top) */}
      <line x1="9" y1="5" x2="9" y2="7" />
      {/* Flange-to-web fillets (right top) */}
      <line x1="15" y1="5" x2="15" y2="7" />
      {/* Flange-to-web fillets (left bottom) */}
      <line x1="9" y1="19" x2="9" y2="17" />
      {/* Flange-to-web fillets (right bottom) */}
      <line x1="15" y1="19" x2="15" y2="17" />
    </svg>
  );
}
