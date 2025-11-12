export type MockScenario = 'default' | 'empty' | 'single' | 'few' | 'exact-page';

export const MOCK_SCENARIOS: Array<{
  value: MockScenario;
  label: string;
  description: string;
}> = [
  { value: 'default', label: 'Default', description: '260 items (production-like)' },
  { value: 'empty', label: 'Empty', description: '0 items (no results)' },
  { value: 'single', label: 'Single', description: '1 item' },
  { value: 'few', label: 'Few', description: '5 items (less than one page)' },
  { value: 'exact-page', label: 'Exact Page', description: '30 items (one full page)' },
] as const;

export const MSW_SCENARIO_HEADER = 'x-msw-scenario';
