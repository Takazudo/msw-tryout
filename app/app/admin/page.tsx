'use client';

import { useState } from 'react';
import { type MockScenario, MOCK_SCENARIOS } from '../../mocks/types';

export default function AdminPage() {
  const [mswEnabled, setMswEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('msw_enabled') === 'true';
  });
  const [scenario, setScenario] = useState<MockScenario>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem('msw_scenario') || 'default') as MockScenario;
  });

  const handleToggleMSW = () => {
    const newValue = !mswEnabled;
    setMswEnabled(newValue);
    localStorage.setItem('msw_enabled', String(newValue));

    // Reload page to initialize/destroy MSW
    window.location.reload();
  };

  const handleScenarioChange = (newScenario: MockScenario) => {
    setScenario(newScenario);
    localStorage.setItem('msw_scenario', newScenario);

    // No reload needed - MSW will pick up the change on next request
    alert(
      `Scenario changed to: ${newScenario}\nThe new scenario will apply on the next API request.`,
    );
  };

  const handlePurge = () => {
    if (confirm('This will clear all MSW settings and reload the page. Continue?')) {
      localStorage.removeItem('msw_enabled');
      localStorage.removeItem('msw_scenario');
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-zd-black px-hgap-sm py-vgap-md">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-vgap-2xs mb-vgap-sm">
          <h1 className="text-3xl font-bold text-zd-white">MSW Admin Control</h1>
          <p className="text-zd-gray">
            Configure Mock Service Worker settings for development and testing.
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`flex flex-col gap-vgap-2xs px-hgap-xs py-vgap-xs rounded-lg mb-vgap-sm ${
            mswEnabled
              ? 'bg-zd-notify/10 border-2 border-zd-notify'
              : 'bg-zd-gray2 border-2 border-zd-gray'
          }`}
        >
          <div className="flex items-center gap-hgap-2xs">
            <div
              className={`w-hgap-xs h-hgap-xs rounded-full ${mswEnabled ? 'bg-zd-notify animate-pulse' : 'bg-zd-gray'}`}
            />
            <span className="font-semibold text-zd-white">
              MSW Status: {mswEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          {mswEnabled && (
            <p className="text-sm text-zd-gray">
              Current Scenario: <span className="font-mono font-semibold">{scenario}</span>
            </p>
          )}
        </div>

        {/* MSW Toggle */}
        <div className="bg-zd-gray2 border-2 border-zd-gray rounded-lg px-hgap-sm py-vgap-sm flex flex-col gap-vgap-xs mb-vgap-sm">
          <div>
            <h2 className="text-xl font-bold text-zd-white mb-vgap-2xs">MSW Toggle</h2>
            <p className="text-sm text-zd-gray">
              Enable or disable Mock Service Worker. Requires page reload to take effect.
            </p>
          </div>

          <button
            onClick={handleToggleMSW}
            className={`px-hgap-sm py-vgap-xs rounded-lg font-semibold transition-colors ${
              mswEnabled
                ? 'bg-zd-error hover:bg-zd-error/80 text-zd-white'
                : 'bg-zd-notify hover:bg-zd-notify/80 text-zd-white'
            }`}
          >
            {mswEnabled ? '🔴 Disable MSW' : '🟢 Enable MSW'}
          </button>
        </div>

        {/* Scenario Selector */}
        {mswEnabled && (
          <div className="bg-zd-gray2 border-2 border-zd-gray rounded-lg px-hgap-sm py-vgap-sm flex flex-col gap-vgap-xs mb-vgap-sm">
            <div>
              <h2 className="text-xl font-bold text-zd-white mb-vgap-2xs">Scenario Selector</h2>
              <p className="text-sm text-zd-gray">
                Choose which mock data scenario to use. Changes apply immediately on next API
                request.
              </p>
            </div>

            <div className="flex flex-col gap-vgap-2xs">
              {MOCK_SCENARIOS.map((s) => (
                <label
                  key={s.value}
                  className={`flex items-start gap-hgap-2xs px-hgap-xs py-vgap-xs rounded-lg border-2 cursor-pointer transition-colors ${
                    scenario === s.value
                      ? 'bg-zd-active/10 border-zd-active'
                      : 'bg-zd-black border-zd-gray hover:border-zd-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={s.value}
                    checked={scenario === s.value}
                    onChange={() => handleScenarioChange(s.value)}
                    className="mt-1px"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-zd-white">{s.label}</div>
                    <div className="text-sm text-zd-gray">{s.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Purge Button */}
        <div className="bg-zd-gray2 border-2 border-zd-gray rounded-lg px-hgap-sm py-vgap-sm flex flex-col gap-vgap-xs mb-vgap-sm">
          <div>
            <h2 className="text-xl font-bold text-zd-white mb-vgap-2xs">Reset Settings</h2>
            <p className="text-sm text-zd-gray">
              Clear all MSW settings from localStorage and reload the page.
            </p>
          </div>

          <button
            onClick={handlePurge}
            className="px-hgap-sm py-vgap-xs rounded-lg font-semibold bg-zd-black hover:bg-zd-gray2 text-zd-white border-2 border-zd-gray transition-colors"
          >
            🗑️ Purge MSW Settings
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-hgap-xs">
          <button
            onClick={handleGoHome}
            className="px-hgap-sm py-vgap-xs rounded-lg font-semibold bg-zd-active hover:bg-zd-active/80 text-zd-white transition-colors"
          >
            ← Back to Gallery
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-vgap-sm px-hgap-xs py-vgap-xs bg-zd-gray2/50 border border-zd-gray rounded-lg">
          <h3 className="font-semibold text-zd-white mb-vgap-2xs">ℹ️ About MSW</h3>
          <p className="text-sm text-zd-gray">
            Mock Service Worker (MSW) intercepts API requests and returns mock data. This is useful
            for:
          </p>
          <ul className="list-disc list-inside text-sm text-zd-gray mt-vgap-2xs flex flex-col gap-1px">
            <li>Testing edge cases (empty results, single items, etc.)</li>
            <li>Developing UI without depending on backend</li>
            <li>Running tests in isolation</li>
            <li>Faster development iteration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
