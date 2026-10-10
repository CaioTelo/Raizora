import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/tmp/raizora-block2-browser/node_modules/playwright');
const destination = fileURLToPath(new URL('./', import.meta.url));
const browser = await chromium.launch({ headless: true });
const report = { browser: await browser.version(), mode: 'production localhost:3106, Chromium native printToPDF, A4 @page, scale 1, backgrounds disabled', cases: [], errors: [], passed: false,
  limitations: ['Headless PDF and print media do not prove native OS dialog cancellation/saving.', 'Firefox/WebKit/Safari and physical printers not exercised; T052–T062 remain pending.'] };
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.on('pageerror', e => report.errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
async function capture(name, fixture) {
  await page.emulateMedia({ media: 'print' });
  const metrics = await page.evaluate(() => {
    const root = document.querySelector('.print-plan'); const r = root.getBoundingClientRect();
    const cells = [...root.querySelectorAll('th,td,p,li')];
    return { screenDisplay: getComputedStyle(document.querySelector('.calculator-screen')).display,
      printDisplay: getComputedStyle(root).display, visibleControls: [...document.querySelectorAll('button,input,select,nav')].filter(e => e.getBoundingClientRect().width > 0).length,
      weeks: [...root.querySelectorAll('.print-week-table caption')].map(e => e.textContent),
      entries: root.querySelectorAll('.print-week-table tbody tr').length,
      overflow: cells.filter(e => { const c = e.getBoundingClientRect(); return c.left < r.left - 1 || c.right > r.right + 1 || e.scrollWidth > e.clientWidth + 1; }).map(e => e.textContent),
      pageRules: [...document.styleSheets].flatMap(s => [...s.cssRules].filter(r => r.cssText.startsWith('@page')).map(r => r.cssText)),
    };
  });
  assert.equal(metrics.screenDisplay, 'none'); assert.equal(metrics.printDisplay, 'block'); assert.equal(metrics.visibleControls, 0); assert.equal(metrics.weeks.length, 16); assert.deepEqual(metrics.overflow, []);
  const expected = ['Vegetativo', 'Floração'].flatMap(s => Array.from({ length: 8 }, (_, i) => `${s} · Semana ${i + 1}`)); assert.deepEqual(metrics.weeks, expected);
  await page.pdf({ path: destination + name + '.pdf', preferCSSPageSize: true, printBackground: false, scale: 1, displayHeaderFooter: false, tagged: true });
  report.cases.push({ name, fixture, ...metrics });
  await page.emulateMedia({ media: 'screen' });
}
try {
  await page.goto('http://127.0.0.1:3106/calculadora', { waitUntil: 'networkidle' });
  await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).fill('10');
  await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).fill('2');
  await page.getByRole('button', { name: /Avançar/ }).click(); await page.getByRole('button', { name: /Avançar/ }).click();
  assert.equal(await page.getByRole('table').count(), 0); assert.equal(await page.getByRole('article').count(), 5); assert.equal(await page.getByRole('region', { name: 'Duração do ciclo' }).count(), 1);
  const before = await page.locator('.print-plan').innerHTML();
  await capture('complete-vegetative1', 'current production wizard 10L/2L all five');
  await page.getByRole('combobox', { name: 'Estágio', exact: true }).selectOption('flowering'); await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('4');
  assert.equal(await page.locator('.print-plan').innerHTML(), before);
  await page.evaluate(() => { window.printCalls = 0; window.submitCalls = 0; const native = window.print.bind(window); window.print = () => { window.printCalls++; native(); }; document.querySelector('form').addEventListener('submit', () => window.submitCalls++); });
  await page.getByRole('button', { name: 'Imprimir plano completo', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => ({ print: window.printCalls, submit: window.submitCalls })), { print: 1, submit: 0 });
  assert.equal(await page.getByRole('combobox', { name: 'Semana', exact: true }).inputValue(), '4'); assert.equal(await page.locator('.print-plan').innerHTML(), before);
  await capture('complete-flowering4', 'same result, distinct active week and native window.print return');
  await page.screenshot({ path: destination + 'screen-after-print.png', fullPage: true });
  // Navigation regression and shared Recipe/Summary state after returning from print.
  await page.getByRole('combobox', { name: 'Estágio', exact: true }).selectOption('vegetative'); await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('8');
  await page.getByRole('button', { name: 'Próxima', exact: true }).click(); assert.equal(await page.getByRole('combobox', { name: 'Estágio', exact: true }).inputValue(), 'flowering'); assert.equal(await page.getByRole('combobox', { name: 'Semana', exact: true }).inputValue(), '1');
  await page.getByRole('button', { name: 'Anterior', exact: true }).click(); assert.equal(await page.getByRole('combobox', { name: 'Semana', exact: true }).inputValue(), '8');
  await page.getByRole('button', { name: /Avançar/ }).click(); assert.equal(await page.locator('.print-plan').count(), 0); await page.getByRole('button', { name: /Avançar/ }).click(); assert.ok((await page.locator('.totals-table').textContent()).includes('260 g'));
  await page.getByRole('button', { name: 'Voltar', exact: true }).click(); await page.getByRole('button', { name: 'Voltar', exact: true }).click(); await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  assert.equal(await page.locator('input[type=checkbox]:checked').count(), 5);
  for (const label of ['Coringa Blend', 'Plant Protein', 'Terpeno Plus', 'Tricomax']) await page.getByRole('checkbox', { name: label, exact: true }).uncheck();
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  assert.equal(await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).inputValue(), '10'); assert.equal(await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).inputValue(), '2');
  await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).fill('10,25'); await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).fill('');
  await page.getByRole('button', { name: /Avançar/ }).click(); await page.getByRole('button', { name: /Avançar/ }).click(); await capture('subset-decimal', 'production Joker only 10.25L, no foliar volume');
  const cssFiles = await readdir('.next/static/css'); const css = (await Promise.all(cssFiles.filter(f => f.endsWith('.css')).map(f => readFile('.next/static/css/' + f, 'utf8')))).join('\n');
  for (const name of ['incomplete', 'long-many', 'subcent']) {
    const html = await readFile('/tmp/raizora-block3-fixtures/' + name + '.html', 'utf8');
    await page.setContent('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>' + css + '</style></head><body>' + html + '</body></html>');
    await capture(name, 'temporary SSR harness, production PrintPlan, existing engine and synthetic fixture; no public QA route');
  }
  assert.deepEqual(report.errors, []); report.passed = true;
} catch (error) { report.failure = error.stack; throw error; }
finally { await writeFile(destination + 'browser-print.json', JSON.stringify(report, null, 2)); await browser.close(); }
