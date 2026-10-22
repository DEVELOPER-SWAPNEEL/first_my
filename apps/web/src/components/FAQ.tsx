import { useId, useState } from 'react';
export function FAQItem({question,answer}:{question:string;answer:string}) {
  const [open,setOpen]=useState(false); const id=useId();
  return <article className={`faq-item ${open?'is-open':''}`}><h3><button aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{question}<span className="faq-plus" aria-hidden="true"><i/><i/></span></button></h3><div id={id} className="faq-answer" aria-hidden={!open} inert={!open}><div><p>{answer}</p></div></div></article>;
}
