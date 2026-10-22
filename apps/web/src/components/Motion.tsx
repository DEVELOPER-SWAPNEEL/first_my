import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
interface MotionPreference { reduced: boolean; previewReduced: boolean; setPreviewReduced: (value: boolean) => void }
const MotionContext = createContext<MotionPreference>({reduced:false,previewReduced:false,setPreviewReduced:()=>{}});
export function MotionProvider({children}: {children: ReactNode}) {
  const [systemReduced,setSystemReduced] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [previewReduced,setPreviewReduced] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    update(); media.addEventListener('change',update);
    return () => media.removeEventListener('change',update);
  },[]);
  const reduced = systemReduced || (import.meta.env.DEV && previewReduced);
  return <MotionContext.Provider value={{reduced,previewReduced,setPreviewReduced}}><div className="motion-root" data-motion={reduced ? 'reduced' : 'full'}>{children}</div></MotionContext.Provider>;
}
export const useMotionPreference = () => useContext(MotionContext);
/** Motion never drives fixture state. Content remains visible if observation is unavailable. */
export function Reveal({children,className = '',delay = 0}: {children: ReactNode; className?: string; delay?: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const {reduced} = useMotionPreference();
  const [phase,setPhase] = useState<'visible' | 'pending'>('visible');
  useEffect(() => {
    const element = ref.current;
    if (!element || reduced || typeof IntersectionObserver === 'undefined') {setPhase('visible'); return;}
    // Never conceal content currently in focus or already within the viewport.
    if (element.contains(document.activeElement) || element.getBoundingClientRect().top < window.innerHeight) {setPhase('visible'); return;}
    setPhase('pending');
    const observer = new IntersectionObserver(entries => {if(entries.some(e=>e.isIntersecting)){setPhase('visible');observer.disconnect();}}, {threshold:0.04, rootMargin:'0px 0px -24px 0px'});
    observer.observe(element);
    return () => observer.disconnect();
  },[reduced]);
  return <div ref={ref} className={`reveal ${className}`} data-reveal={phase} style={{'--reveal-delay':`${delay}ms`} as CSSProperties} onFocusCapture={() => setPhase('visible')}>{children}</div>;
}
/** Retrigger a short present-only animation on navigation without remounting pages/camera/dialogs. */
export function PageMotion({children}: {children: ReactNode}) {
  const location = useLocation(); const ref=useRef<HTMLDivElement>(null); const {reduced}=useMotionPreference();
  useEffect(() => {const node=ref.current; if (!node || reduced || typeof node.animate !== 'function') return; const animation=node.animate([{opacity:.78,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'}); return ()=>animation.cancel();},[location.pathname,location.search,reduced]);
  return <div ref={ref} className="page-motion">{children}</div>;
}
/** Continuous CSS effects pause both offscreen and in background tabs. */
export function AmbientRegion({children,className = ''}: {children:ReactNode;className?:string}) {
  const ref=useRef<HTMLDivElement>(null); const {reduced}=useMotionPreference();
  const [visible,setVisible]=useState(true); const [hidden,setHidden]=useState(document.hidden);
  useEffect(()=> {const update=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',update); return ()=>document.removeEventListener('visibilitychange',update);},[]);
  useEffect(()=> {if(!ref.current || typeof IntersectionObserver==='undefined') return; const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.isIntersecting ?? true),{threshold:0});observer.observe(ref.current);return()=>observer.disconnect();},[]);
  return <div ref={ref} className={`ambient-region ${className}`} data-paused={reduced || !visible || hidden ? 'true':'false'}>{children}</div>;
}
