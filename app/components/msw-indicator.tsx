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
      className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-colors flex items-center hgap-2 z-50"
      aria-label="MSW Admin Settings"
    >
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <div className="vgap-0">
        <div className="text-xs font-semibold">MSW Active</div>
        <div className="text-[10px] opacity-90">{scenario}</div>
      </div>
    </Link>
  );
}
