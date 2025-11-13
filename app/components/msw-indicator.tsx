'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type MockScenario } from '../mocks/types';

export function MSWIndicator() {
  const [mswEnabled, setMswEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const localStorageEnabled = localStorage.getItem('msw_enabled') === 'true';
    const envEnabled = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
    return localStorageEnabled || envEnabled;
  });
  const [scenario, setScenario] = useState<MockScenario>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem('msw_scenario') || 'default') as MockScenario;
  });

  useEffect(() => {
    const checkMSW = () => {
      const localStorageEnabled = localStorage.getItem('msw_enabled') === 'true';
      const envEnabled = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
      const enabled = localStorageEnabled || envEnabled;
      const currentScenario = (localStorage.getItem('msw_scenario') || 'default') as MockScenario;

      setMswEnabled(enabled);
      setScenario(currentScenario);
    };

    // Listen for storage changes (in case admin page is open in another tab)
    window.addEventListener('storage', checkMSW);
    return () => window.removeEventListener('storage', checkMSW);
  }, []);

  if (!mswEnabled) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="fixed bottom-hgap-xs right-hgap-xs bg-zd-notify text-zd-white px-hgap-xs py-vgap-xs rounded-lg shadow-lg hover:bg-zd-notify/80 transition-colors flex items-center gap-hgap-2xs z-50"
      aria-label="MSW Admin Settings"
    >
      <div className="w-vgap-xs h-vgap-xs bg-zd-white rounded-full animate-pulse" />
      <div className="flex flex-col gap-0">
        <div className="text-xs font-semibold">MSW Active</div>
        <div className="text-xs opacity-90">{scenario}</div>
      </div>
    </Link>
  );
}
