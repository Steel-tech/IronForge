interface CostCardProps {
  icon: string;
  label: string;
  value: string;
  note?: string;
}

export function CostCard({ icon, label, value, note }: CostCardProps) {
  return (
    <div className="bg-white border border-iron-200 rounded-xl p-4">
      <div className="flex items-center gap-2 text-sm text-iron-500 mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-lg font-semibold text-iron-900">{value}</div>
      {note && <div className="text-xs text-iron-400 mt-1">{note}</div>}
    </div>
  );
}
