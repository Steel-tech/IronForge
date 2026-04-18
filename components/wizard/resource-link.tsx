// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import type { Resource } from "@/lib/types/content";
import { FileText, Globe, BookOpen, Phone, Building2, ExternalLink } from "lucide-react";

interface ResourceLinkProps {
  resource: Resource;
}

const TYPE_ICONS: Record<Resource["type"], React.ReactNode> = {
  form: <FileText className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  guide: <BookOpen className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  office: <Building2 className="w-4 h-4" />,
};

export function ResourceLink({ resource }: ResourceLinkProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg border border-cyber-border bg-cyber-dark/50 hover:border-neon-blue/40 hover:bg-cyber-dark transition-all"
    >
      <span className="text-neon-blue shrink-0 mt-0.5">
        {TYPE_ICONS[resource.type] ?? <ExternalLink className="w-4 h-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-mono text-text-primary group-hover:text-neon-blue transition-colors flex items-center gap-1.5">
          {resource.title}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-xs text-text-muted mt-0.5">{resource.description}</div>
        <div className="text-[10px] text-neon-blue/50 mt-1 truncate font-mono">
          {resource.url}
        </div>
      </div>
    </a>
  );
}
