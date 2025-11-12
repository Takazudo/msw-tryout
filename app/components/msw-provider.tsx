'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);
  const [mswEnabled, setMswEnabled] = useState(false);

  useEffect(() => {
    // Check if MSW is enabled via localStorage OR environment variable
    const localStorageEnabled = localStorage.getItem('msw_enabled') === 'true';
    const envEnabled = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
    const shouldEnableMSW = localStorageEnabled || envEnabled;

    setMswEnabled(shouldEnableMSW);

    const initMSW = async () => {
      if (shouldEnableMSW) {
        try {
          const { worker } = await import('../mocks/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
          });
          const scenario = localStorage.getItem('msw_scenario') || 'default';
          console.log('[MSW] Mocking enabled');
          console.log('[MSW] Current scenario:', scenario);
        } catch (error) {
          console.error('[MSW] Failed to initialize:', error);
        }
      }
      setMswReady(true);
    };

    initMSW();
  }, []);

  // Show loading state while MSW is initializing (if enabled)
  if (mswEnabled && !mswReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zd-bg-1">
        <div className="text-center vgap-2">
          <div className="text-zd-fg-2">Initializing MSW...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
