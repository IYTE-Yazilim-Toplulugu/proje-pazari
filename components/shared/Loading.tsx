import { Loader2 } from "lucide-react";

type LoadingProps = {
  text?: string;
};

export default function Loading({ text = "Yükleniyor..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      <p className="text-sm text-[var(--color-text-secondary)]">{text}</p>
    </div>
  );
}
