'use client';

export function useToast() {
  const error = (title: string, description?: string) => {
    // TODO: Implement with a toast library (react-hot-toast, sonner, etc.)
    console.error(`${title}${description ? `: ${description}` : ''}`);
  };

  const success = (title: string, description?: string) => {
    console.log(`✓ ${title}${description ? `: ${description}` : ''}`);
  };

  const info = (title: string, description?: string) => {
    console.info(`ℹ ${title}${description ? `: ${description}` : ''}`);
  };

  const warning = (title: string, description?: string) => {
    console.warn(`⚠ ${title}${description ? `: ${description}` : ''}`);
  };

  return { error, success, info, warning };
}
