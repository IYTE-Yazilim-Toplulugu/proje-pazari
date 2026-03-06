"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-(--color-btn-primary) hover:bg-(--color-btn-primary-hover) text-white focus:ring-(--color-primary)",
  secondary:
    "bg-(--color-btn-secondary) hover:bg-(--color-btn-secondary-hover) text-(--color-text-primary) focus:ring-(--color-border)",
  danger:
    "bg-(--color-error) hover:bg-(--color-error-dark) text-white focus:ring-(--color-error)",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors duration-200",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
