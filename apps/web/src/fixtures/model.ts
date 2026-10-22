/** M1 DTO-shaped fixtures. No account, transfer, timer, or persistence service. */
export type Units = string;
export type Persona = 'a' | 'b';
export type Scenario = 'initial' | 'submitting' | 'acknowledged' | 'confirmed' | 'failed' | 'unknown' | 'stale' | 'loading' | 'empty';
export type PaymentState = 'acknowledged' | 'confirmed' | 'failed';
export interface RequestPreview { id: string; merchant: string; units: Units; state: 'open' | 'paid' | 'expired' | 'cancelled'; generation: string }
export interface PaymentPreview { id: string; requestId: string; customer: string; merchant: string; units: Units; state: PaymentState; timestamp: string; reason?: string }
export interface Scene { scenario: Scenario; customerUnits: Units; merchantUnits: Units; request: RequestPreview; payment: PaymentPreview | null; stale: boolean }
export const GENERATION = 'fixture-1';
export const REQUEST_ID = 'req_sample_01';
export const personas = { a: 'Demo Customer A', b: 'Demo Customer B' } as const;
export const scenarioNames: Record<Scenario, string> = { initial: 'Initial / open', submitting: 'Submission preview', acknowledged: 'Acknowledged attempt', confirmed: 'Confirmed fixture', failed: 'Failed attempt', unknown: 'Unknown outcome', stale: 'Stale data', loading: 'Loading', empty: 'Empty' };
export const scenarios = Object.keys(scenarioNames) as Scenario[];
export const sampleRequest: RequestPreview = Object.freeze({id: REQUEST_ID, merchant: 'Demo Merchant A', units: '250', state: 'open', generation: GENERATION});
const paymentBase = { id: 'pay_fixture_01', requestId: REQUEST_ID, customer: personas.a, merchant: sampleRequest.merchant, units: '250', timestamp: '13 Oct 2026 · 14:30 IST' };
export function fixtureScene(scenario: Scenario, persona: Persona = 'a'): Scene {
  const state = scenario === 'confirmed' || scenario === 'failed' || scenario === 'acknowledged' ? scenario : null;
  // B never inherits A's confirmed transfer or history.
  const payment = state && persona === 'a' ? {...paymentBase, state, ...(state === 'failed' ? {reason: 'The fixture provider declined this attempt. No demo units moved.'} : {})} : null;
  return {scenario, customerUnits: persona === 'b' ? '100' : scenario === 'confirmed' ? '9750' : '10000', merchantUnits: scenario === 'confirmed' ? '250' : '0', request: {...sampleRequest, state: scenario === 'confirmed' ? 'paid' : 'open'}, payment, stale: scenario === 'stale'};
}
export function scenarioFrom(value: string | null, fallback: Scenario = 'initial'): Scenario { return scenarios.includes(value as Scenario) ? value as Scenario : fallback; }
