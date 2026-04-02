import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Yükleniyor...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
