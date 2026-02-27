"use client";

import type { ChecklistItem } from "@/lib/types/content";

interface ChecklistProps {
  items: ChecklistItem[];
  completedItems: string[];
  onToggle: (itemId: string) => void;
}

export function Checklist({ items, completedItems, onToggle }: ChecklistProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const completed = completedItems.includes(item.id);
        return (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
              completed
                ? "bg-green-50 border-green-200"
                : "bg-white border-iron-200 hover:border-iron-300"
            }`}
            onClick={() => onToggle(item.id)}
          >
            <div className="mt-0.5">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  completed
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-iron-300"
                }`}
              >
                {completed && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm font-medium ${
                    completed ? "text-green-800 line-through" : "text-iron-900"
                  }`}
                >
                  {item.label}
                  {item.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-iron-500 mt-0.5">{item.description}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-forge-600 hover:text-forge-700 mt-1 inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  🔗 Open link →
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
