import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Mark } from './ui';
import { PaymentSymbol } from './PaymentVisuals';
import { useMotionPreference } from './Motion';
const items=[{id:'hero',label:'Home',icon:'wallet'},{id:'features',label:'Features',icon:'qr'},{id:'journey',label:'Journey',icon:'review'},{id:'product',label:'Preview',icon:'status'},{id:'merchants',label:'Merchants',icon:'merchant'},{id:'faq',label:'FAQ',icon:'receipt'}] as const;
export function MarketingNav() {
  const [active,setActive]=useState('hero'); const [open,setOpen]=useState(false);
  const [marker,setMarker]=useState({x:4,width:94});
  const nav=useRef<HTMLElement>(null); const toggle=useRef<HTMLButtonElement>(null); const {reduced}=useMotionPreference();
  useEffect(()=> {
    let frame=0;
    const measure=()=> {frame=0;let current='hero'; for(const item of items){const node=document.getElementById(item.id);if(node && node.getBoundingClientRect().top<=180)current=item.id;}setActive(current);};
    const schedule=()=> {if(typeof requestAnimationFrame==='undefined'){measure();return;}if(!frame)frame=requestAnimationFrame(measure);};
    measure();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    return()=> {window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);if(frame && typeof cancelAnimationFrame!=='undefined')cancelAnimationFrame(frame);};
  },[]);
  useEffect(()=> {const measure=()=> {const a=nav.current?.querySelector<HTMLElement>(`[data-section="${active}"]`); if(a)setMarker({x:a.offsetLeft,width:a.offsetWidth});};measure();window.addEventListener('resize',measure);return()=>window.removeEventListener('resize',measure);},[active,open,reduced]);
  useEffect(()=> {if(!open)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);},[open]);
  return <header className="remix-header wrap"><Link to="/" aria-label="VARTAMAN home"><Mark/></Link><button ref={toggle} className="menu-toggle icon-button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="landing-navigation" onClick={()=>setOpen(!open)}>{open?<Icon name="cross"/>:<span className="menu-lines" aria-hidden="true"/>}</button><nav ref={nav} id="landing-navigation" className={`pill-nav ${open?'is-open':''}`} aria-label="Marketing navigation"><span className="nav-indicator" aria-hidden="true" style={{transform:`translateX(${marker.x}px)`,width:marker.width}}/>{items.map(item=><a key={item.id} data-section={item.id} aria-current={active===item.id?'location':undefined} href={`#${item.id}`} onClick={()=>{setActive(item.id);setOpen(false);if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>document.getElementById(item.id)?.focus({preventScroll:true}));}}><PaymentSymbol name={item.icon}/>{item.label}</a>)}</nav><Link to="/customer" className="luminous-cta header-cta"><span className="cta-capsule"><Icon name="arrow" size={18}/></span>Explore demo</Link></header>;
}
