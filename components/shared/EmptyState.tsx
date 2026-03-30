'use client';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      ) : null}
    </div>
  );
}
