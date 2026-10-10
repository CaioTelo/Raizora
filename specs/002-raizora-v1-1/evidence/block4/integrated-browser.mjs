import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/tmp/raizora-block2-browser/node_modules/playwright');
const axePath = '/tmp/raizora-block4-qa/node_modules/axe-core/axe.min.js';
const destination = fileURLToPath(new URL('./', import.meta.url));
const browser = await chromium.launch({ headless: true });
const report = { browser: await browser.version(), passed: false, flows: [], accessibility: [], fields: [], errors: [], limitations: ['axe WCAG 2 A/AA + WCAG 2.1 A/AA checks complement keyboard/visual checks; no screen reader used.', 'Incomplete Wizard uses temporary bundle and anchor shim for Next Link; no public route or official matrix change.'] };
const next = p => p.getByRole('button', { name: /Avançar/ }).click();
const back = p => p.getByRole('button', { name: 'Voltar', exact: true }).click();
const volume = p => p.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true });
const foliar = p => p.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true });
const expected = JSON.parse(await readFile('/tmp/raizora-v11-print-qa/expected.json', 'utf8'));
const normalize = text => text.replace(/\s+/g, '');
async function fields(page, name) {
  const rows = await page.locator('.print-week-table tbody tr').evaluateAll(rs => rs.map(r => [...r.children].map(c => c.textContent)));
  const totals = await page.locator('.print-totals tbody tr').evaluateAll(rs => rs.map(r => [...r.children].map(c => c.textContent)));
  assert.deepEqual(rows.map(r=>r.map(normalize)), expected[name].rows.map(r=>r.map(normalize)));
  assert.deepEqual(totals.map(r=>r.map(normalize)), expected[name].totals.map(r=>r.map(normalize)));
  report.fields.push({ name, weeklyRows: rows.length, totalRows: totals.length, everyCellMatchesCanonicalResult: true });
}
async function audit(page, name, width) {
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } });
    return { violations: r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({html:n.html,target:n.target,summary:n.failureSummary}))})), incomplete: r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})), passes:r.passes.length, version:r.testEngine.version };
  });
  const metrics = await page.evaluate(() => ({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,printVisible:[...document.querySelectorAll('.print-plan')].some(e=>getComputedStyle(e).display!=='none')}));
  assert.ok(metrics.scrollWidth <= metrics.width+1); assert.equal(metrics.printVisible,false);
  report.accessibility.push({name,width,...result,...metrics});
  await page.screenshot({path:destination+`${name}-${width}.png`,fullPage:true});
  assert.deepEqual(result.violations,[],`${name} ${width} axe violations`);
}
try {
  for (const width of [360,640,768,1024,1280]) {
    const context = await browser.newContext({viewport:{width,height:900}}); const page=await context.newPage();
    page.on('pageerror',e=>report.errors.push(e.message));
    await page.goto('http://127.0.0.1:3110/',{waitUntil:'networkidle'}); await audit(page,'landing',width);
    await page.getByRole('link',{name:'Começar agora'}).click(); await audit(page,'configuration',width);
    await next(page); assert.equal(await volume(page).getAttribute('aria-invalid'),'true'); assert.equal(await volume(page).evaluate(e=>e===document.activeElement),true);
    const help=await volume(page).getAttribute('aria-describedby'); assert.ok(help);
    assert.ok((await page.locator('#'+help.split(' ')[0]).textContent()).includes('10%')); await audit(page,'configuration-error',width);
    await volume(page).fill('10'); await foliar(page).fill('2'); await next(page); await audit(page,'products',width); await next(page);
    await fields(page,'complete'); await audit(page,'plan',width);
    assert.equal(await page.getByRole('region',{name:'Plano de Nutrição completo para impressão'}).count(),0);
    await page.getByRole('combobox',{name:'Semana',exact:true}).selectOption('3');
    assert.ok((await page.getByRole('article',{name:'Coringa Blend',exact:true}).textContent()).includes('20 ml/semana'));
    await next(page); await audit(page,'recipe',width); await next(page); await audit(page,'summary',width);
    assert.ok((await page.locator(width>=1024?'.totals-table':'.totals-cards').textContent()).includes('260 g'));
    await back(page); await back(page); await back(page);
    for(const label of ['Coringa Blend','Plant Protein','Terpeno Plus','Tricomax']) await page.getByRole('checkbox',{name:label,exact:true}).uncheck();
    await back(page); assert.equal(await foliar(page).inputValue(),'2'); await volume(page).fill('20'); await foliar(page).fill('');
    await next(page); await next(page); assert.equal(await page.getByRole('article').count(),1); assert.ok((await page.getByRole('article').textContent()).includes('40 g/semana'));
    assert.ok((await page.locator('.print-context').textContent()).includes('volume não necessário'));
    await next(page); assert.ok((await page.getByRole('region',{name:'Fertirrigação',exact:true}).textContent()).includes('40 g'));
    await next(page); assert.ok((await page.locator(width>=1024?'.totals-table':'.totals-cards').textContent()).includes('520 g'));
    await back(page); await back(page); await back(page);
    await page.getByRole('checkbox',{name:'Joker',exact:true}).uncheck(); await next(page);
    assert.equal(await page.getByRole('group',{name:'Produtos do planejamento'}).evaluate(e=>e===document.activeElement),true); assert.equal(await page.locator('.print-plan').count(),0);
    await page.getByRole('checkbox',{name:'Joker',exact:true}).check(); await page.getByRole('checkbox',{name:'Plant Protein',exact:true}).check(); await next(page);
    const correction=page.getByRole('button',{name:'Preencher volume foliar'}); assert.equal(await correction.evaluate(e=>e===document.activeElement),true); await correction.click();
    assert.equal(await foliar(page).evaluate(e=>e===document.activeElement),true); await foliar(page).fill('3'); await next(page); await next(page);
    assert.ok((await page.getByRole('article',{name:'Plant Protein',exact:true}).textContent()).includes('18 ml/semana'));
    await back(page); await back(page); await volume(page).fill('inválido'); await next(page);
    assert.equal(await page.getByRole('heading',{name:'Configuração',level:2,exact:true}).count(),1); assert.equal(await page.locator('.print-plan').count(),0);
    assert.equal(await page.getByRole('region',{name:'Produtos da semana'}).count(),0);
    report.flows.push({width,allProducts:true,subset:true,updatedVolumeAndSelection:true,emptySelection:true,foliarReactivation:true,invalidInputNoStaleResult:true}); await context.close();
  }
  const cssFiles=await readdir('.next/static/css'); const css=(await Promise.all(cssFiles.filter(f=>f.endsWith('.css')).map(f=>readFile('.next/static/css/'+f,'utf8')))).join('\n');
  for(const width of [360,1280]) {
    const context=await browser.newContext({viewport:{width,height:900}}); const page=await context.newPage();
    await page.setContent('<!doctype html><html lang="pt-BR"><head><title>RAIZORA QA temporário</title><style>'+css+'</style></head><body><div id="qa-root"></div></body></html>'); await page.addScriptTag({path:'/tmp/raizora-v11-print-qa/wizard.js'});
    await volume(page).fill('10'); await foliar(page).fill('2'); await next(page); await next(page); await page.getByRole('combobox',{name:'Semana',exact:true}).selectOption('4');
    assert.ok((await page.getByRole('article',{name:'Joker',exact:true}).textContent()).includes('Regra não confirmada')); await fields(page,'incomplete'); await audit(page,'incomplete-plan',width);
    await next(page); assert.ok((await page.getByRole('status').textContent()).includes('Receita incompleta')); assert.ok(!(await page.getByRole('region',{name:'Fertirrigação',exact:true}).textContent()).includes('40 g')); await audit(page,'incomplete-recipe',width);
    await next(page); const totals=await page.locator(width>=1024?'.totals-table':'.totals-cards').textContent(); assert.ok(totals.includes('Subtotal conhecido (parcial): 240 g')); assert.ok(!totals.includes('260 g')); await audit(page,'incomplete-summary',width);
    await back(page); await back(page); await back(page); await page.getByRole('checkbox',{name:'Joker',exact:true}).uncheck(); await next(page);
    assert.equal(await page.locator('.error-panel').count(),0); assert.ok(!(await page.locator('.print-context li, .print-week-table tbody th, .print-totals tbody th').allTextContents()).some(text=>text.includes('Joker')));
    report.flows.push({width,syntheticIncompleteWizard:true,NO_RULEWithoutDefinitiveTotal:true,deselectedRestoresCompleteness:true}); await context.close();
  }
  assert.deepEqual(report.errors,[]); report.passed=true;
} catch(error) {report.failure=error.stack; throw error;}
finally {await writeFile(destination+'integrated-browser.json',JSON.stringify(report,null,2)); await browser.close();}
console.log(`PASS ${report.flows.length} integrated flows; ${report.accessibility.length} axe audits; every print cell matches canonical result.`);
