import { GENERATION, REQUEST_ID, sampleRequest } from './model';
import type { RequestPreview } from './model';
export function requestURL(origin: string, requestId = REQUEST_ID): string {
  const url = new URL('/customer/scan', origin);
  url.search = new URLSearchParams({v: '1', generation: GENERATION, request: requestId}).toString();
  return url.href;
}
export function resolveFixtureLink(input: string, origin: string): { request?: RequestPreview; error?: string } {
  try {
    const url = new URL(input);
    if (url.origin !== origin || url.username || url.password || url.pathname !== '/customer/scan' || url.hash) return {error: 'Use a fixture request link from this local demo origin.'};
    const keys = [...url.searchParams.keys()];
    if (keys.length !== 3 || new Set(keys).size !== 3 || keys.some(k => !['v', 'generation', 'request'].includes(k)) || url.searchParams.get('v') !== '1') return {error: 'Unsupported fixture QR version or link shape.'};
    if (url.searchParams.get('generation') !== GENERATION) return {error: 'This fixture generation is unavailable. Use the sample request.'};
    if (url.searchParams.get('request') !== REQUEST_ID) return {error: 'Request not in the fixture catalogue. Draft QR resolution belongs to Milestone 2.'};
    return {request: sampleRequest};
  } catch { return {error: 'Paste a complete, valid fixture request URL.'}; }
}
