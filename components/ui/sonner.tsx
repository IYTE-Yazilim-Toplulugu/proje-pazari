"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      {...props}
      toastOptions={{
        style: {
          background: "var(--color-card)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border)",
        },
      }}
    />
  );
}
