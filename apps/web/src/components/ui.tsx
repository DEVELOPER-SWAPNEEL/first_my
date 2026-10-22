import { useEffect, useRef, type ReactNode } from 'react';
import { AmbientRegion } from './Motion';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { formatUnits, illustrativeINR } from '../fixtures/money';
import { requestURL } from '../fixtures/links';
import { scenarioNames, type Scenario, type Units } from '../fixtures/model';

export function Mark({small = false}: {small?: boolean}) { return <span className={`wordmark ${small ? 'small' : ''}`}><svg aria-hidden="true" viewBox="0 0 40 40"><path d="M6 8 20 33 34 8M13 8 20 21 27 8"/></svg><span>VARTAMAN<span className="wordmark-dot">.</span></span></span>; }
export function Icon({name, size = 22}: {name: 'arrow' | 'scan' | 'wallet' | 'store' | 'check' | 'clock' | 'cross' | 'receipt' | 'link'; size?: number}) {
  const paths = {arrow: 'M5 12h14m-6-6 6 6-6 6', scan: 'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 12h10', wallet: 'M4 6h14v14H4zM4 6V4h12M14 10h6v6h-6z', store: 'M3 10l2-6h14l2 6M4 10v10h16V10M9 20v-6h6v6M3 10c2 3 4 3 6 0 2 3 4 3 6 0 2 3 4 3 6 0', check: 'M5 12l4 4L19 6', clock: 'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', cross: 'M6 6l12 12M6 18 18 6', receipt: 'M5 3h14v18l-3-2-4 2-4-2-3 2zM9 8h6M9 12h6', link: 'M10 14l4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0'};
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg>;
}
export function ActionLink({to, children, secondary = false, ...rest}: {to: string; children: ReactNode; secondary?: boolean; className?: string}) { return <Link to={to} className={`button ${secondary ? 'secondary' : 'primary'} ${rest.className ?? ''}`}>{children}</Link>; }
export function PageTitle({eyebrow, title, children}: {eyebrow: string; title: string; children?: ReactNode}) { return <div className="page-title"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <p className="muted">{children}</p>}</div>; }
export function Notice({children, tone = 'neutral'}: {children: ReactNode; tone?: 'neutral' | 'warning' | 'error'}) { return <div className={`notice ${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>; }
export function PreviewLabel({scenario = 'initial'}: {scenario?: Scenario}) { return <span className="preview-label">UI preview · {scenarioNames[scenario]}</span>; }
export function Amount({units, large = false}: {units: Units; large?: boolean}) {return <span className={`amount ${large ? 'large' : ''}`}>{formatUnits(units)} <span>DEMO</span></span>;}
export function RateNote({units = '250'}: {units?: Units}) {return <p className="rate-note">Illustrative {illustrativeINR(units)} at ₹100 / DEMO.<br/>Not live pricing or INR settlement.</p>;}
export function QRCard({id}: {id?: string}) { return <div className="qr-wrap"><div className="qr-paper"><QRCodeSVG value={requestURL(window.location.origin, id)} size={192} marginSize={4} level="M" title="Fixture request URL QR; not a payment credential"/></div><span className="micro">Fixture QR · version 1 · generation fixture-1</span></div>; }
export function EmptyState({title = 'Nothing here yet', children}: {title?: string; children?: ReactNode}) { return <div className="empty-state"><span className="icon-tile"><Icon name="receipt"/></span><h2>{title}</h2><p className="muted">{children ?? 'This preview has no payment records. Explore the sample request to see the journey.'}</p></div>; }
export function Skeleton() {return <AmbientRegion><div className="skeleton-box" role="status" aria-label="Loading preview"><div className="skeleton line"/><div className="skeleton big"/><div className="skeleton line short"/><p className="micro">Loading preview — static fixture</p></div></AmbientRegion>;}
export function Dialog({open, title, onClose, children}: {open: boolean; title: string; onClose: () => void; children: ReactNode}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.showModal();
    return () => { node?.close(); if (previous?.isConnected) previous.focus(); else (document.querySelector('h1') as HTMLElement | null)?.focus(); };
  }, [open]);
  if (!open) return null;
  return <dialog ref={dialog} aria-labelledby="dialog-title" onCancel={e => {e.preventDefault(); onClose();}}><div className="dialog-head"><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="cross"/></button></div>{children}</dialog>;
}
