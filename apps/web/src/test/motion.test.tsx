import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { MotionProvider, AmbientRegion } from '../components/Motion';
import { fireEvent } from '@testing-library/react';
function open(path='/'){return render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>);}
describe('Visual refinement preserves accessible fixture behavior',()=>{
  it('honors an initially reduced system preference without hidden reveals',()=>{
    vi.stubGlobal('matchMedia',vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})));
    try{const {container}=open();expect(container.querySelector('.motion-root')).toHaveAttribute('data-motion','reduced');expect(container.querySelector('[data-reveal=pending]')).toBeNull();expect(screen.getByRole('heading',{name:'Scan. Review. Pay.'})).toBeInTheDocument();}finally{vi.unstubAllGlobals();}
  });
  it('pauses ambient effects when the document becomes hidden',()=>{
    const {container}=render(<MotionProvider><AmbientRegion><span>Decoration</span></AmbientRegion></MotionProvider>);
    const original=Object.getOwnPropertyDescriptor(document,'hidden');
    try{Object.defineProperty(document,'hidden',{configurable:true,value:true});fireEvent(document,new Event('visibilitychange'));expect(container.querySelector('.ambient-region')).toHaveAttribute('data-paused','true');}finally{if(original)Object.defineProperty(document,'hidden',original);else Reflect.deleteProperty(document,'hidden');}
  });
  it('supports keyboard FAQ expansion with announced expanded state',async()=>{
    const user=userEvent.setup();const {container}=open();const button=screen.getByRole('button',{name:'Does this move real money?'});
    expect(button).toHaveAttribute('aria-expanded','false');button.focus();await user.keyboard('[Space]');expect(button).toHaveAttribute('aria-expanded','true');expect(container.querySelector('.faq-answer')).toHaveAttribute('aria-hidden','false');expect(button).toHaveFocus();
    await user.keyboard('[Space]');expect(button).toHaveAttribute('aria-expanded','false');expect(container.querySelector('.faq-answer')).toHaveAttribute('inert');
  });
  it('keeps duplicated decorative ribbon out of navigation/accessibility content',()=>{
    const {container}=open();expect(container.querySelector('.ribbon-window')).toHaveAttribute('aria-hidden','true');expect(container.querySelectorAll('.ribbon-group')).toHaveLength(2);expect(container.querySelectorAll('.ribbon-track a,.ribbon-track button')).toHaveLength(0);expect(screen.getByRole('list',{name:'Illustrated payment features'}).children).toHaveLength(7);
  });
  it('allows the DEV motion override to persist through fixture navigation',async()=>{
    const user=userEvent.setup();const {container}=open('/preview');await user.click(screen.getByRole('checkbox',{name:'Preview reduced motion'}));expect(container.querySelector('.motion-root')).toHaveAttribute('data-motion','reduced');await user.click(screen.getByRole('link',{name:'Inspect landing page with this preference'}));expect(container.querySelector('.motion-root')).toHaveAttribute('data-motion','reduced');expect(screen.getByRole('heading',{name:'Scan. Review. Pay.'})).toBeInTheDocument();
  });
});
