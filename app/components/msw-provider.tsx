'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      // Only initialize MSW if the environment variable is set
      if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
        const { worker } = await import('../mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        console.log('[MSW] Mocking enabled');
      }
      setMswReady(true);
    };

    initMSW();
  }, []);

  // Don't render children until MSW is ready (if enabled)
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true' && !mswReady) {
    return null;
  }

  return <>{children}</>;
}
