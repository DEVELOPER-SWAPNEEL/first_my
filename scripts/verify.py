"""Create, retrieve, update and verify one synthetic ticket; leaves evidence data."""
import argparse
import json
import urllib.request

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:8000')
parser.add_argument('--expected-version')
args = parser.parse_args()


def request(path, method='GET', payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(args.url.rstrip('/') + path, data=data, method=method,
                                 headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=5) as response:
        return json.load(response)


version = request('/version')['version']
if args.expected_version and version != args.expected_version:
    raise SystemExit(f'Version mismatch: expected {args.expected_version}, received {version}')
request('/health/ready')
ticket = request('/tickets', 'POST', {'title': 'Synthetic deployment verification'})
if request(f"/tickets/{ticket['id']}") != ticket:
    raise SystemExit('Retrieved ticket differs from created ticket')
request(f"/tickets/{ticket['id']}", 'PATCH', {'status': 'resolved'})
if request(f"/tickets/{ticket['id']}")['status'] != 'resolved':
    raise SystemExit('Status update did not persist')
print(json.dumps({'result': 'passed', 'version': version, 'ticket_id': ticket['id']}))
