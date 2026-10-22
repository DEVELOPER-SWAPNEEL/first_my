import { AmbientRegion } from './Motion';
import { Icon, Amount, Notice } from './ui';
import type { Scenario } from '../fixtures/model';
export const statusCopy: Partial<Record<Scenario, {title: string; body: string; icon: 'clock' | 'check' | 'cross' | 'link' | 'receipt'; tone: string}>> = {
  submitting: {title: 'Sending request', body: 'Submission only. This preview has no acknowledged payment or completed transfer.', icon: 'clock', tone: 'pending'},
  acknowledged: {title: 'Payment acknowledged', body: 'The acknowledged fixture is waiting for confirmation. Balances remain unchanged.', icon: 'clock', tone: 'pending'},
  unknown: {title: 'Outcome not yet known', body: 'A connection interruption would require recovering the same attempt. Do not retry as a new payment.', icon: 'link', tone: 'warning'},
  confirmed: {title: 'Simulated payment confirmed', body: 'Selected confirmed fixture. No payment was executed by this interface.', icon: 'check', tone: 'positive'},
  failed: {title: 'Payment failed', body: 'The fixture provider declined this attempt. No demo units moved.', icon: 'cross', tone: 'negative'},
  stale: {title: 'Data may be out of date', body: 'Last known fixture data is shown. Current payment status is unavailable.', icon: 'link', tone: 'warning'},
  initial: {title: 'Ready to review', body: 'An open sample request. Nothing has been submitted.', icon: 'receipt', tone: 'pending'},
};
export function StatusPresentation({scenario}: {scenario: Scenario}) {
  const copy = statusCopy[scenario] ?? statusCopy.submitting!;
  const acknowledged = scenario === 'acknowledged' || scenario === 'confirmed' || scenario === 'failed';
  return <AmbientRegion><section className={`status-card card ${copy.tone}`} aria-live="polite"><span className={`status-orb ${copy.tone}`}><Icon name={copy.icon} size={32}/></span><h2>{copy.title}</h2><p className="muted">{copy.body}</p><Amount units="250" large/><p className="micro">To Demo Merchant A · synthetic identity</p><ol className="timeline"><li className={acknowledged ? 'done' : ''}>Submission<span>Sending intent</span></li><li className={acknowledged ? 'done' : ''}>Acknowledgement<span>Acceptance only</span></li><li className={scenario === 'confirmed' ? 'done' : ''}>Confirmation<span>Completed simulation</span></li></ol><Notice>Settlement is not applicable. These are manually selected UI fixtures.</Notice></section></AmbientRegion>;
}
