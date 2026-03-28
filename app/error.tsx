"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tErrors = useTranslations("errors");
  const tCommon = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">{tErrors("serverError")}</h2>
      <p className="mb-6 text-[var(--color-text-secondary)]">{tCommon("unknownError")}</p>
      <Button onClick={reset} className="bg-[var(--color-btn-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-btn-primary-hover)]">
        {tCommon("retry")}
      </Button>
    </div>
  );
}
