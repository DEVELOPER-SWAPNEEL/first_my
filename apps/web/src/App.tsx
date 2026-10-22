import { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import type { Persona } from './fixtures/model';
import { personas, scenarioFrom } from './fixtures/model';
import { Mark, Icon } from './components/ui';
import { Marketing } from './pages/Marketing';
import { Entry, Wallet, Scan, Review, PaymentStatus, History, PaymentDetail, Receipt } from './pages/Customer';
import { MerchantDashboard, RequestForm, RequestDetail } from './pages/Merchant';
import { Gallery } from './pages/Gallery';
import { PaymentSymbolDefinitions } from './components/PaymentVisuals';
import { MotionProvider, PageMotion } from './components/Motion';
const PersonaContext = createContext<{persona: Persona; setPersona: (value: Persona) => void}>({persona: 'a', setPersona: () => {}});
export function usePreview(defaultScenario: Parameters<typeof scenarioFrom>[1] = 'initial') {
  const [params] = useSearchParams();
  const context = useContext(PersonaContext);
  return {...context, persona: params.get('persona') === 'b' ? 'b' as const : context.persona, scenario: scenarioFrom(params.get('scenario'), defaultScenario)};
}
function AppShell() {
  const {pathname} = useLocation();
  const merchant = pathname.startsWith('/merchant');
  const {persona} = usePreview();
  return <><header className="app-header"><Link to="/" aria-label="VARTAMAN home"><Mark small/></Link><span className="mode-tag"><span/>Simulation — no real money</span><Link className="text-link" to={merchant ? '/merchant' : '/customer'}>Change persona</Link></header><div className="app-layout"><aside className="sidebar"><p className="eyebrow">{merchant ? 'Merchant workspace' : 'Customer wallet'}</p><nav aria-label="Demo navigation">{merchant ? <><NavLink to="/merchant/dashboard"><Icon name="store"/>Overview</NavLink><NavLink to="/merchant/request/new"><Icon name="scan"/>Request preview</NavLink><NavLink to="/merchant/history"><Icon name="receipt"/>Payment history</NavLink></> : <><NavLink to="/customer/wallet"><Icon name="wallet"/>Wallet</NavLink><NavLink to="/customer/scan"><Icon name="scan"/>Scan & review</NavLink><NavLink to="/customer/history"><Icon name="receipt"/>History</NavLink></>}</nav><div className="sidebar-persona"><span className="avatar">{merchant ? 'M' : persona.toUpperCase()}</span><div><strong>{merchant ? 'Demo Merchant A' : personas[persona]}</strong><span>Synthetic identity</span></div></div><p className="micro">UI foundation · Milestone 1<br/>No transfer is executed.</p><Link className="text-link" to={merchant ? '/customer' : '/merchant'}>{merchant ? 'Explore customer view' : 'Explore merchant view'} <Icon name="arrow" size={16}/></Link></aside><main id="main" className="workspace"><div className="fixture-banner">UI preview · Deterministic synthetic fixtures. Navigation does not move balances or create payment records.</div><PageMotion><Outlet/></PageMotion></main></div><footer className="app-footer">VARTAMAN prototype · DEMO is an illustrative internal unit. No blockchain or bank settlement.</footer></>;
}
function RouteFocus() {const {pathname} = useLocation(); useEffect(() => {window.scrollTo({top:0,left:0,behavior:'instant'}); document.querySelector('h1')?.setAttribute('tabindex','-1'); (document.querySelector('h1') as HTMLElement | null)?.focus({preventScroll:true});}, [pathname]); return null;}
export function App() {
  const [persona, setPersona] = useState<Persona>('a');
  return <MotionProvider><PaymentSymbolDefinitions/><PersonaContext.Provider value={{persona,setPersona}}><a className="skip-link" href="#main">Skip to content</a><RouteFocus/><Routes><Route path="/" element={<Marketing/>}/><Route element={<AppShell/>}><Route path="/customer" element={<Entry/>}/><Route path="/customer/wallet" element={<Wallet/>}/><Route path="/customer/scan" element={<Scan/>}/><Route path="/customer/review" element={<Review/>}/><Route path="/customer/status" element={<PaymentStatus/>}/><Route path="/customer/history" element={<History/>}/><Route path="/customer/payment" element={<PaymentDetail/>}/><Route path="/customer/receipt" element={<Receipt/>}/><Route path="/merchant" element={<Entry merchant/>}/><Route path="/merchant/dashboard" element={<MerchantDashboard/>}/><Route path="/merchant/request/new" element={<RequestForm/>}/><Route path="/merchant/request" element={<RequestDetail/>}/><Route path="/merchant/history" element={<History merchant/>}/><Route path="/merchant/payment" element={<PaymentDetail merchant/>}/></Route>{import.meta.env.DEV && <Route path="/preview" element={<Gallery/>}/>}<Route path="*" element={<main id="main" className="not-found"><Mark/><h1>Page unavailable</h1><p>This prototype has customer and merchant previews only.</p><Link className="button primary" to="/">Return home</Link></main>}/></Routes></PersonaContext.Provider></MotionProvider>;
}
