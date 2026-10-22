from scripts.check_scan import acceptable


def test_incomplete_unknown_or_severe_findings_fail_closed():
    assert not acceptable({'imageScanStatus':{'status':'IN_PROGRESS'}})[0]
    assert not acceptable({'imageScanStatus':{'status':'COMPLETE'}})[0]
    assert not acceptable({'imageScanStatus':{'status':'COMPLETE'},'imageScanFindings':{'findingSeverityCounts':{'HIGH':1}}})[0]
    assert acceptable({'imageScanStatus':{'status':'COMPLETE'},'imageScanFindings':{'findingSeverityCounts':{}}})[0]
