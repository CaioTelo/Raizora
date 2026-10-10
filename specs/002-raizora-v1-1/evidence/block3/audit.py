"""Local audit for Block 3 only; does not run or close tasks T052+."""
import hashlib
import json
import pathlib
import re

ROOT = pathlib.Path.cwd()
DESTINATION = ROOT / 'specs/002-raizora-v1-1/evidence/block3'
BASELINE = json.loads((DESTINATION / 'baseline.json').read_text())
PROTECTED = json.loads((ROOT / 'specs/002-raizora-v1-1/evidence/block2/integrity.json').read_text())['protected']
ALLOWED = {
    'src/app/globals.css',
    'src/features/calculator/CalculatorWizard.tsx',
    'src/features/calculator/views/PlanView.tsx',
    'src/features/calculator/components/ResultValue.tsx',
    'src/features/calculator/components/ScheduleDuration.tsx',
    'tests/ui/calculator-wizard.test.tsx',
    'specs/002-raizora-v1-1/tasks.md',
    'specs/002-raizora-v1-1/implementation-review.md',
}
NEW_ALLOWED = {
    'src/features/calculator/components/PrintPlan.tsx',
    'tests/ui/print-plan.test.tsx',
    'tests/ui/result-value.test.tsx',
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


protected = {p: {'before': BASELINE[p], 'after': sha(ROOT / p), 'preserved': BASELINE[p] == sha(ROOT / p)} for p in PROTECTED}
changed = {p: {'before': before, 'after': sha(ROOT / p) if (ROOT / p).is_file() else None} for p, before in BASELINE.items() if not (ROOT / p).is_file() or before != sha(ROOT / p)}
new = sorted(str(p.relative_to(ROOT)) for folder in ['src', 'tests', 'specs', '.specify/memory'] for p in (ROOT / folder).rglob('*') if p.is_file() and str(p.relative_to(ROOT)) not in BASELINE and not str(p.relative_to(ROOT)).startswith('specs/002-raizora-v1-1/evidence/block3/'))
unexpected = sorted(set(changed) - ALLOWED) + sorted(set(new) - NEW_ALLOWED)
current_tasks = (ROOT / 'specs/002-raizora-v1-1/tasks.md').read_text()
original_tasks = pathlib.Path('/tmp/raizora-block3-tasks-before.md').read_text()
normalize = lambda value: re.sub(r'- \[[Xx]\] (T0(?:3[8-9]|4\d|5[01]) )', r'- [ ] \1', value[value.index('## Fontes e convenções'):])
task_contract_preserved = normalize(current_tasks) == normalize(original_tasks)
complete_ids = re.findall(r'- \[[Xx]\] (T\d{3}) ', current_tasks)
pending_ids = re.findall(r'- \[ \] (T\d{3}) ', current_tasks)
report = {'protectedCount': len(protected), 'allProtectedPreserved': all(v['preserved'] for v in protected.values()), 'unexpectedChanges': unexpected, 'taskDefinitionsDependenciesPreserved': task_contract_preserved, 'completeTasks': len(complete_ids), 'pendingTasks': pending_ids, 'protected': protected}
(DESTINATION / 'integrity.json').write_text(json.dumps(report, indent=2) + '\n')
(DESTINATION / 'changed-files.json').write_text(json.dumps({'modified': changed, 'newProductionTests': new, 'evidence': sorted(str(p.relative_to(ROOT)) for p in DESTINATION.rglob('*') if p.is_file())}, indent=2) + '\n')
assert report['allProtectedPreserved'] and not unexpected and task_contract_preserved
assert all(f'T{n:03d}' in pending_ids for n in range(52, 63))
print(f"PASS: {len(protected)} protected hashes; task definitions/dependencies unchanged; {len(complete_ids)}/62 complete; T052–T062 pending.")
