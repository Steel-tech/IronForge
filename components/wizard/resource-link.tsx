import type { Resource } from "@/lib/types/content";

interface ResourceLinkProps {
  resource: Resource;
}

const TYPE_ICONS: Record<Resource["type"], string> = {
  form: "📄",
  website: "🌐",
  guide: "📖",
  phone: "📞",
  office: "🏢",
};

export function ResourceLink({ resource }: ResourceLinkProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg border border-iron-200 hover:border-forge-300 hover:bg-forge-50 transition-colors group"
    >
      <span className="text-lg shrink-0">
        {TYPE_ICONS[resource.type] ?? "🔗"}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-iron-900 group-hover:text-forge-700">
          {resource.title}
        </div>
        <div className="text-xs text-iron-500 mt-0.5">{resource.description}</div>
        <div className="text-xs text-forge-500 mt-1 truncate">{resource.url}</div>
      </div>
    </a>
  );
}
