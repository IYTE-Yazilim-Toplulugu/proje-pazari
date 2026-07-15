import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Unauthorized</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        You do not have permission to access this page.
      </p>
      <Link className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]" href="/">
        Go home
      </Link>
    </main>
  );
}
