"""Fail closed on incomplete scans or HIGH/CRITICAL ECR basic scan findings."""
import json
import sys


def acceptable(payload):
    if payload.get('imageScanStatus',{}).get('status')!='COMPLETE':
        return False,'ECR basic scan is incomplete or unsupported'
    findings=payload.get('imageScanFindings')
    if not isinstance(findings,dict) or not isinstance(findings.get('findingSeverityCounts'),dict):
        return False,'ECR scan severity counts are unavailable'
    counts=findings['findingSeverityCounts']
    high=counts.get('HIGH',0);critical=counts.get('CRITICAL',0)
    if not all(isinstance(x,int) and not isinstance(x,bool) and x>=0 for x in (high,critical)):
        return False,'Invalid scan severity counts'
    return high+critical==0,f'HIGH={high} CRITICAL={critical}; basic OS scanning only'


if __name__=='__main__':
    try:
        passed,detail=acceptable(json.load(open(sys.argv[1])))
        print(json.dumps({'scan_gate':'passed' if passed else 'failed','detail':detail}))
        raise SystemExit(0 if passed else 1)
    except (ValueError,OSError,IndexError):
        print('{"scan_gate":"failed","detail":"Scan evidence unavailable"}')
        raise SystemExit(1)
