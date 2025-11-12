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
    <div className="min-h-screen bg-zd-bg-1 vgap-8 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="vgap-4 mb-8">
          <h1 className="text-3xl font-bold text-zd-fg-1">MSW Admin Control</h1>
          <p className="text-zd-fg-2">
            Configure Mock Service Worker settings for development and testing.
          </p>
        </div>

        {/* Status Banner */}
        <div
          className={`vgap-2 p-4 rounded-lg mb-8 ${
            mswEnabled
              ? 'bg-green-500/10 border-2 border-green-500'
              : 'bg-zd-bg-2 border-2 border-zd-line-1'
          }`}
        >
          <div className="flex items-center hgap-2">
            <div
              className={`w-3 h-3 rounded-full ${mswEnabled ? 'bg-green-500 animate-pulse' : 'bg-zd-fg-3'}`}
            />
            <span className="font-semibold text-zd-fg-1">
              MSW Status: {mswEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          {mswEnabled && (
            <p className="text-sm text-zd-fg-2">
              Current Scenario: <span className="font-mono font-semibold">{scenario}</span>
            </p>
          )}
        </div>

        {/* MSW Toggle */}
        <div className="bg-zd-bg-2 border-2 border-zd-line-1 rounded-lg p-6 vgap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-zd-fg-1 mb-2">MSW Toggle</h2>
            <p className="text-sm text-zd-fg-2">
              Enable or disable Mock Service Worker. Requires page reload to take effect.
            </p>
          </div>

          <button
            onClick={handleToggleMSW}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              mswEnabled
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {mswEnabled ? '🔴 Disable MSW' : '🟢 Enable MSW'}
          </button>
        </div>

        {/* Scenario Selector */}
        {mswEnabled && (
          <div className="bg-zd-bg-2 border-2 border-zd-line-1 rounded-lg p-6 vgap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-zd-fg-1 mb-2">Scenario Selector</h2>
              <p className="text-sm text-zd-fg-2">
                Choose which mock data scenario to use. Changes apply immediately on next API
                request.
              </p>
            </div>

            <div className="vgap-3">
              {MOCK_SCENARIOS.map((s) => (
                <label
                  key={s.value}
                  className={`flex items-start hgap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    scenario === s.value
                      ? 'bg-zd-primary/10 border-zd-primary'
                      : 'bg-zd-bg-1 border-zd-line-1 hover:border-zd-line-2'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={s.value}
                    checked={scenario === s.value}
                    onChange={() => handleScenarioChange(s.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-zd-fg-1">{s.label}</div>
                    <div className="text-sm text-zd-fg-2">{s.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Purge Button */}
        <div className="bg-zd-bg-2 border-2 border-zd-line-1 rounded-lg p-6 vgap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-zd-fg-1 mb-2">Reset Settings</h2>
            <p className="text-sm text-zd-fg-2">
              Clear all MSW settings from localStorage and reload the page.
            </p>
          </div>

          <button
            onClick={handlePurge}
            className="px-6 py-3 rounded-lg font-semibold bg-zd-bg-3 hover:bg-zd-bg-4 text-zd-fg-1 border-2 border-zd-line-1 transition-colors"
          >
            🗑️ Purge MSW Settings
          </button>
        </div>

        {/* Navigation */}
        <div className="flex hgap-4">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 rounded-lg font-semibold bg-zd-primary hover:bg-zd-primary-hover text-white transition-colors"
          >
            ← Back to Gallery
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-zd-bg-2/50 border border-zd-line-1 rounded-lg">
          <h3 className="font-semibold text-zd-fg-1 mb-2">ℹ️ About MSW</h3>
          <p className="text-sm text-zd-fg-2">
            Mock Service Worker (MSW) intercepts API requests and returns mock data. This is useful
            for:
          </p>
          <ul className="list-disc list-inside text-sm text-zd-fg-2 mt-2 vgap-1">
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
