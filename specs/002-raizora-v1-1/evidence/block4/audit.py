"""Audit Block 4 against the captured state and prior protected hashes."""
import hashlib
import json
import pathlib
import re

root = pathlib.Path.cwd()
destination = root / 'specs/002-raizora-v1-1/evidence/block4'
baseline = json.loads((destination / 'baseline.json').read_text())
protected = json.loads((root / 'specs/002-raizora-v1-1/evidence/block3/integrity.json').read_text())['protected']
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

current = {}
for folder in ['src', 'tests', 'specs', '.specify/memory', '.claude']:
    current.update({str(p.relative_to(root)): sha(p) for p in (root / folder).rglob('*') if p.is_file() and 'evidence/block4/' not in str(p)})
current.update({p.name: sha(p) for p in root.iterdir() if p.is_file()})
changes = {p: {'before': before, 'after': current.get(p)} for p, before in baseline.items() if current.get(p) != before}
new = sorted(set(current) - set(baseline))
allowed = {'.claude/napkin.md', 'specs/002-raizora-v1-1/tasks.md', 'specs/002-raizora-v1-1/implementation-review.md'}
new_allowed = {'specs/002-raizora-v1-1/evidence/browser-smoke.json', 'specs/002-raizora-v1-1/evidence/print-harness.md', 'specs/002-raizora-v1-1/evidence/print-review.md', 'specs/002-raizora-v1-1/evidence/checks.md'}
protected_report = {p: {'before': data['after'], 'after': current.get(p), 'preserved': data['after'] == current.get(p)} for p, data in protected.items()}
unexpected = sorted(set(changes) - allowed) + sorted(set(new) - new_allowed)
task_pattern = r'^- \[[ Xx]\] (T\d{3} .*?); Dep\.: (.*)$'
before_tasks = re.findall(task_pattern, (destination / 'tasks-before.md').read_text(), re.M)
tasks = (root / 'specs/002-raizora-v1-1/tasks.md').read_text()
task_contracts = before_tasks == re.findall(task_pattern, tasks, re.M)
src_tests = all(current.get(p) == before for p, before in baseline.items() if p.startswith(('src/', 'tests/')))
historical = all(current.get(p) == before for p, before in baseline.items() if p.startswith(('specs/001-', 'specs/002-raizora-v1-1/evidence/block2/', 'specs/002-raizora-v1-1/evidence/block3/')))
report = {'protectedCount': len(protected_report), 'allProtectedPreserved': all(v['preserved'] for v in protected_report.values()), 'allProductionAndTestsPreserved': src_tests, 'MVPAndPriorBlockEvidencePreserved': historical, 'unexpectedChanges': unexpected, 'taskDefinitionsDependenciesPreserved': task_contracts, 'completeTasks': len(re.findall(r'^- \[[Xx]\] T\d{3} ', tasks, re.M)), 'protected': protected_report}
(destination / 'integrity.json').write_text(json.dumps(report, indent=2) + '\n')
(destination / 'changed-files.json').write_text(json.dumps({'modified': changes, 'newOutsideBlock4': new, 'newBlock4Evidence': sorted(str(p.relative_to(root)) for p in destination.rglob('*') if p.is_file())}, indent=2) + '\n')
assert report['allProtectedPreserved'] and src_tests and historical and not unexpected and task_contracts, report
print(f"PASS: {len(protected_report)} protected hashes; all production/tests and historical evidence intact; task contracts preserved; {report['completeTasks']}/62 tasks marked.")
