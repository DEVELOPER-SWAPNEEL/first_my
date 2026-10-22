import { useId } from 'react';
import emblemURL from '../assets/visuals/vartaman-emblem.svg';
import symbolSource from '../assets/visuals/payment-symbols.svg?raw';
import orbitURL from '../assets/visuals/process-orbit.svg';
import { AmbientRegion } from './Motion';
export type PaymentSymbolName = 'qr' | 'wallet' | 'merchant' | 'review' | 'authorize' | 'status' | 'receipt';
export const paymentSymbols: {name:PaymentSymbolName;label:string}[] = [{name:'qr',label:'QR request'},{name:'wallet',label:'Wallet'},{name:'merchant',label:'Merchant'},{name:'review',label:'Review'},{name:'authorize',label:'Authorization'},{name:'status',label:'Payment status'},{name:'receipt',label:'Receipt'}];
const symbolMarkup=symbolSource.replace(/^<svg[^>]*>/,'').replace('</svg>','').replaceAll('id="','id="vartaman-');
export function PaymentSymbolDefinitions(){return <svg className="visual-symbol-definitions" aria-hidden="true" width="0" height="0" dangerouslySetInnerHTML={{__html:symbolMarkup}}/>;}
export function PaymentSymbol({name,className=''}:{name:PaymentSymbolName;className?:string}) {return <svg className={`payment-symbol ${className}`} viewBox="0 0 48 48" aria-hidden="true"><use href={`#vartaman-${name}`}/></svg>;}
export function FeatureMedallion({name,small=false}:{name:PaymentSymbolName;small?:boolean}) {return <span className={`feature-medallion ${small?'compact':''}`}><PaymentSymbol name={name}/></span>;}
export function Emblem({small=false}:{small?:boolean}) {return <div className={`emblem ${small?'compact':''}`}><span className="emblem-rim"/><span className="emblem-inner"/><img src={emblemURL} alt=""/><span className="emblem-shine"/></div>;}
export function PaymentConstellation() {
  const id=useId();
  return <><AmbientRegion className="constellation"><div className="halo halo-back" aria-hidden="true"/><div className="light-beam" aria-hidden="true"/><div className="ribbon-window" aria-hidden="true"><div className="ribbon-track">{[0,1].map(group=><div className="ribbon-group" key={group}>{[...paymentSymbols,...paymentSymbols].map((symbol,index)=><FeatureMedallion key={`${symbol.name}-${index}`} name={symbol.name}/>)}</div>)}</div></div><div className="central-emblem" aria-hidden="true"><Emblem/></div><img className="orbit-lines" src={orbitURL} alt=""/><span className="orbital-speck speck-one" aria-hidden="true"/><span className="orbital-speck speck-two" aria-hidden="true"/></AmbientRegion><p id={id} className="constellation-caption">Original feature illustrations · not currencies or partner logos</p><ul className="sr-only" aria-label="Illustrated payment features">{paymentSymbols.map(s=><li key={s.name}>{s.label}</li>)}</ul></>;
}
