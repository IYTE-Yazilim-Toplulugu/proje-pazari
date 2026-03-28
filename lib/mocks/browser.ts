import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Start in browser only for development
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
  worker.start();
}