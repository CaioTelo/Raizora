import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(process.cwd() + '/package.json');
const { build } = require('/tmp/raizora-block3-qa/node_modules/esbuild');
await mkdir('/tmp/raizora-v11-print-qa', { recursive: true });
await build({ stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
  import React from 'react';
  import { createRoot } from 'react-dom/client';
  import { CalculatorWizard } from './src/features/calculator/CalculatorWizard';
  import { plantasQueCuram } from './src/data/brands/plantas-que-curam/brand';
  import { incompleteSchedule } from './tests/ui/result-fixtures';
  createRoot(document.getElementById('qa-root')).render(<CalculatorWizard brand={plantasQueCuram} schedule={incompleteSchedule()} />);
` }, bundle: true, platform: 'browser', format: 'iife', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, outfile: '/tmp/raizora-v11-print-qa/wizard.js',
plugins: [{ name: 'qa-link', setup(builder) {
  builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'qa-link', namespace: 'qa' }));
  builder.onLoad({ filter: /.*/, namespace: 'qa' }, () => ({ contents: 'import React from "react"; export default function Link(props) { return React.createElement("a", props); }', resolveDir: process.cwd() }));
} }] });
await build({ stdin: { resolveDir: process.cwd(), loader: 'ts', contents: `
  import assert from 'node:assert/strict';
  import { writeFileSync } from 'node:fs';
  import { calculateNutritionPlan } from './src/domain/calculation/calculate-plan';
  import { feedingSchedule, incompleteSchedule, applicationResultFor } from './tests/ui/result-fixtures';
  import { formatNumber, formatQuantity, formatAggregate } from './src/features/calculator/presentation/format-quantity';
  import { frequencyLabel } from './src/features/calculator/presentation/result-selectors';
  const totals = [[140,120,260],[160,null,160],[96,500,596],[32,null,32],[null,100,100]];
  const doses = [[[1,1,2,2,2,2,2,2],[2,2,2,3,3,null,null,null]],[[5,5,5,5,5,5,5,5],Array(8).fill(null)],[[3,3,3,3,3,3,3,3],[4,4,4,6,8,8,8,8]],[[1,1,1,1,1,1,1,1],Array(8).fill(null)],[Array(8).fill(null),[null,null,null,null,1,2,3,4]]];
  const foliar = [1,1,2,2,2,2,3,3];
  const result = applicationResultFor();
  const records = [];
  for (let s=0;s<2;s++) for(let w=0;w<8;w++) for(let p=0;p<5;p++) {
    const e=result.weeks[s*8+w].entries[p], dose=doses[p][s][w];
    if(dose===null) { assert.equal(e.status,'NOT_APPLICABLE'); assert.ok(!('weeklyAmount' in e)); }
    else {
      const isFoliar=s===0 && [1,2,3].includes(p), volume=isFoliar?2:10, count=isFoliar?foliar[w]:1;
      const unit=[0,4].includes(p)?'GRAM':'MILLILITER';
      assert.equal(e.status,'ACTIVE'); assert.equal(e.dose.value,dose); assert.equal(e.preparationVolumeLiters,volume);
      assert.equal(e.effectiveApplicationsPerWeek,count); assert.equal(e.applicationType,isFoliar?'FOLIAR':'FERTIGATION');
      assert.deepEqual(e.amountPerApplication,{unit,value:dose*volume}); assert.deepEqual(e.weeklyAmount,{unit,value:dose*volume*count});
    }
    records.push(e);
  }
  assert.equal(result.weeks.length,16); assert.equal(records.length,80);
  result.productTotals.forEach((p,i)=> { assert.equal(p.cycle.amount.value,totals[i][2]); p.byStage.forEach((s,j)=>totals[i][j]===null?assert.equal(s.aggregate.status,'NOT_APPLICABLE'):assert.equal(s.aggregate.amount.value,totals[i][j])); });
  const count3=calculateNutritionPlan({schedule:feedingSchedule,selectedProductIds:result.selectedProductIds,configuration:{fertigationVolumeLiters:10,foliarVolumeLiters:2,fertigationApplicationsPerWeek:3}});
  assert.equal(count3.status,'SUCCESS'); assert.deepEqual(count3.result.productTotals.map(t=>t.cycle.amount.value),[780,160,1596,32,300]);
  assert.equal(count3.result.weeks[0].entries[0].amountPerApplication.value,10); assert.equal(count3.result.weeks[0].entries[0].weeklyAmount.value,30);
  const incomplete=applicationResultFor(incompleteSchedule()); assert.equal(incomplete.completeness,'INCOMPLETE'); assert.equal(incomplete.productTotals[0].cycle.status,'INCOMPLETE'); assert.ok(!('amount' in incomplete.productTotals[0].cycle)); assert.equal(incomplete.productTotals[0].cycle.knownSubtotal.value,240);
  const without=applicationResultFor(incompleteSchedule(),result.selectedProductIds.filter(id=>id!=='joker')); assert.equal(without.completeness,'COMPLETE');
  function expected(plan,schedule) {
    const vol = v=>formatNumber(v)==='0' && v>0?'< 0,01 L':formatNumber(v)+' L';
    return { rows:plan.weeks.flatMap(w=>w.entries.map(e=>e.status==='ACTIVE'?[schedule.products.find(p=>p.id===e.productId).name,formatNumber(e.dose.value)+(e.dose.unit==='GRAM_PER_LITER'?' g/L':' ml/L'),(e.applicationType==='FERTIGATION'?'Fertirrigação':'Pulverização foliar')+frequencyLabel(e),vol(e.preparationVolumeLiters),formatQuantity(e.amountPerApplication).text,formatQuantity(e.weeklyAmount).text+'/semana']:[schedule.products.find(p=>p.id===e.productId).name,e.status==='NO_RULE'?'Regra não confirmada':'—'+(e.reason==='STAGE_NOT_APPLICABLE'?'Não aplicável neste estágio':'Não utilizado nesta semana')])), totals:plan.productTotals.map(t=>[schedule.products.find(p=>p.id===t.productId).name,...t.byStage.map(s=>agg(s.aggregate)),agg(t.cycle)]) };
  }
  function agg(a) {return formatAggregate(a).text+(a.status==='NOT_APPLICABLE'?formatAggregate(a).accessibleText:'')+(a.status==='INCOMPLETE'&&a.knownSubtotal?'Subtotal conhecido (parcial): '+formatQuantity(a.knownSubtotal).text:'');}
  const plans={complete:expected(result,feedingSchedule),incomplete:expected(incomplete,incompleteSchedule())};
  writeFileSync('/tmp/raizora-v11-print-qa/expected.json',JSON.stringify(plans));
  writeFileSync('specs/002-raizora-v1-1/evidence/block4/mathematical-oracles.json',JSON.stringify({passed:true,source:'spec V11-01–06/V11-CICLO and preserved MVP matrix, independent expected dose arrays; no official source reaudit',weeks:16,entries:80,foliarApplications:foliar,foliarTotal:16,applicationTotals:result.productTotals,genericCount3Totals:count3.result.productTotals,REG03:{selected:incomplete.productTotals[0],deselected:without.completeness},entries:records},null,2));
` }, bundle: true, platform: 'node', format: 'cjs', outfile: '/tmp/raizora-v11-print-qa/oracles.cjs' });
require('/tmp/raizora-v11-print-qa/oracles.cjs');
console.log('PASS 80 independent weekly oracles, stage/cycle/count3/NO_RULE; temporary incomplete Wizard bundle prepared.');
