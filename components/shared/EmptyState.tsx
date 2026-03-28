"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      {Icon ? <Icon className="mb-4 h-12 w-12 text-[var(--color-text-tertiary)]" /> : null}
      <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description ? <p className="mb-6 max-w-md text-sm text-[var(--color-text-secondary)]">{description}</p> : null}
      {action ? (
        <Button onClick={action.onClick} className="bg-[var(--color-btn-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-btn-primary-hover)]">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
