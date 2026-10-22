import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';
import { resolveFixtureLink, requestURL } from '../fixtures/links';
import { parseAmount } from '../fixtures/money';
function open(path: string) {return render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>);}
describe('Milestone 1 UI smoke checks', () => {
  it('supports marketing entry, disclosure and Customer B selection without transfers', async () => {
    const user = userEvent.setup(); open('/');
    await user.click(screen.getAllByRole('link',{name: 'Explore customer demo'})[0]);
    const enter = screen.getByRole('button',{name: 'Explore customer demo'});
    expect(enter).toBeDisabled();
    await user.click(screen.getByRole('radio',{name:/Demo Customer B/}));
    await user.click(screen.getByRole('checkbox'));
    await user.click(enter);
    expect(screen.getByRole('heading',{name:'Your wallet, at a glance.'})).toBeInTheDocument();
    expect(screen.getByText('1.00')).toBeInTheDocument();
  });
  it('opens an explicit chooser on authorization; acknowledgement has no receipt', async () => {
    const user = userEvent.setup(); open('/customer/review');
    await user.click(screen.getByRole('button',{name:/Authorize simulated payment/}));
    expect(screen.getByRole('dialog',{name:'Choose a status preview'})).toBeInTheDocument();
    expect(screen.queryByText('Simulated payment confirmed')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Acknowledged attempt'}));
    expect(screen.getByRole('heading',{name:'Payment acknowledged'})).toBeInTheDocument();
    expect(screen.queryByRole('link',{name:/receipt/i})).not.toBeInTheDocument();
  });
  it.each(['initial','acknowledged','failed','unknown','submitting'])('guards receipt for %s', scenario => {
    open(`/customer/receipt?scenario=${scenario}`);
    expect(screen.getByText(/Receipt unavailable/)).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'Print fixture receipt'})).not.toBeInTheDocument();
  });
  it('shows a labelled receipt only for the confirmed fixture', () => {
    open('/customer/receipt?scenario=confirmed');
    expect(screen.getByRole('heading',{name:'Simulated payment confirmed'})).toBeInTheDocument();
    expect(screen.getByText('UI preview receipt · No transfer was executed')).toBeInTheDocument();
  });
  it('validates exact amount and previews a custom draft honestly', async () => {
    const user = userEvent.setup(); open('/merchant/request/new');
    await user.clear(screen.getByLabelText('Amount in DEMO')); await user.type(screen.getByLabelText('Amount in DEMO'),'2.501');
    await user.click(screen.getByRole('button',{name:/Preview request & QR/}));
    expect(screen.getByRole('alert')).toHaveTextContent('at most two decimal places');
    await user.clear(screen.getByLabelText('Amount in DEMO')); await user.type(screen.getByLabelText('Amount in DEMO'),'3.25');
    await user.click(screen.getByRole('button',{name:/Preview request & QR/}));
    expect(screen.getByText(/Custom amount 3.25 DEMO is a design draft only/)).toBeInTheDocument();
    expect(screen.getByLabelText('Fixture request URL')).toHaveValue(requestURL(window.location.origin,'req_draft_preview'));
  });
  it('rejects external or malformed fixture links without navigating', async () => {
    const user = userEvent.setup(); open('/customer/scan');
    await user.type(screen.getByLabelText('Paste a fixture request link'),'https://example.com/customer/scan?v=1&generation=fixture-1&request=req_sample_01');
    await user.click(screen.getByRole('button',{name:/Review fixture link/}));
    expect(screen.getByRole('alert')).toHaveTextContent('local demo origin');
    expect(screen.getByRole('heading',{name:'Begin with a merchant request.'})).toBeInTheDocument();
  });
  it('releases a camera stream that resolves after leaving the scan page', async () => {
    const user = userEvent.setup();
    const stop = vi.fn();
    let release!: (stream: MediaStream) => void;
    vi.stubGlobal('isSecureContext', true);
    const original = Object.getOwnPropertyDescriptor(navigator, 'mediaDevices');
    Object.defineProperty(navigator, 'mediaDevices', {configurable:true,value:{getUserMedia:vi.fn(() => new Promise<MediaStream>(resolve => {release=resolve;}))}});
    try {
      open('/customer/scan');
      await user.click(screen.getByRole('button',{name:'Enable camera preview'}));
      await user.click(screen.getByRole('link',{name:'Open sample request'}));
      release({getTracks:() => [{stop}]} as unknown as MediaStream);
      await waitFor(() => expect(stop).toHaveBeenCalledOnce());
    } finally {
      if (original) Object.defineProperty(navigator, 'mediaDevices', original); else Reflect.deleteProperty(navigator,'mediaDevices');
      vi.unstubAllGlobals();
    }
  });
  it('keeps exact amount and strict fixture URL contracts', () => {
    expect(parseAmount('0.01')).toBe('1'); expect(parseAmount('1.999')).toBeNull(); expect(parseAmount('-1')).toBeNull(); expect(parseAmount('0')).toBeNull(); expect(parseAmount('1000000.01')).toBeNull();
    const origin='http://127.0.0.1:5173'; const url=requestURL(origin);
    expect(resolveFixtureLink(url,origin).request?.units).toBe('250');
    for (const invalid of [url+'&amount=250',url+'&v=1',url.replace('fixture-1','fixture-2'),url.replace('req_sample_01','req_unknown')]) expect(resolveFixtureLink(invalid,origin).error).toBeTruthy();
  });
});
