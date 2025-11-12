'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { MSW_SCENARIO_HEADER } from '../mocks/types';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);
  const [shouldEnableMSW] = useState(() => {
    // Check synchronously before mount to avoid race conditions
    if (typeof window === 'undefined') return false;
    const localStorageEnabled = localStorage.getItem('msw_enabled') === 'true';
    const envEnabled = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
    return localStorageEnabled || envEnabled;
  });

  useEffect(() => {
    if (!shouldEnableMSW) {
      setMswReady(true);
      return;
    }

    const initMSW = async () => {
      try {
        const { worker } = await import('../mocks/browser');

        // Intercept all requests and inject scenario as custom header
        const handleRequest = ({ request }: { request: Request }) => {
          const scenario = localStorage.getItem('msw_scenario') || 'default';
          request.headers.set(MSW_SCENARIO_HEADER, scenario);
        };

        worker.events.on('request:start', handleRequest);

        await worker.start({
          onUnhandledRequest: 'bypass',
        });

        const scenario = localStorage.getItem('msw_scenario') || 'default';
        // eslint-disable-next-line no-console
        console.info('[MSW] Mocking enabled');
        // eslint-disable-next-line no-console
        console.info('[MSW] Current scenario:', scenario);

        // Cleanup event handler on unmount
        return () => {
          worker.events.removeAllListeners('request:start');
        };
      } catch (error) {
        console.error('[MSW] Failed to initialize:', error);
        return undefined;
      } finally {
        setMswReady(true);
      }
    };

    const cleanup = initMSW();

    // Return cleanup function
    return () => {
      cleanup?.then((cleanupFn) => cleanupFn?.());
    };
  }, [shouldEnableMSW]);

  // Block rendering until MSW is ready to avoid race conditions
  if (!mswReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zd-bg-1">
        <div className="text-center vgap-2">
          <div className="text-zd-fg-2">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
