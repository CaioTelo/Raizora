import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// QA dependency lives outside the delivered app and its lockfile.
const require = createRequire(import.meta.url);
const { chromium } = require('/tmp/raizora-block2-browser/node_modules/playwright');
const destination = fileURLToPath(new URL('./', import.meta.url));
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { browser: await browser.version(), mode: 'production npm run start, 127.0.0.1:3110', viewports: [], errors: [], limitations: ['Chromium headless only; Firefox, WebKit/Safari and screen readers were not exercised.', '200% reflow uses half the CSS viewport and deviceScaleFactor 2; browser toolbar zoom was not exercised.'], passed: false };
const positions = ['vegetative', 'flowering'].flatMap(stageId => Array.from({ length: 8 }, (_, i) => ({ stageId, label: stageId === 'vegetative' ? 'Vegetativo' : 'Floração', weekNumber: i + 1 })));
async function measure(page, screenName) {
  const metrics = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const clipped = [...document.querySelectorAll('button, select, .plan-cards p, .plan-cards dt, .plan-cards dd, .plan-cards h4')].flatMap(element => {
      const r = element.getBoundingClientRect();
      if (!r.width || !r.height) return [];
      return r.left < -1 || r.right > width + 1 || element.scrollWidth > element.clientWidth + 1 ? [{ text: element.textContent?.slice(0, 100), left: r.left, right: r.right, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }] : [];
    });
    return { width, scrollWidth: document.documentElement.scrollWidth, clipped, productColumns: document.querySelector('.nutrition-card-grid') ? getComputedStyle(document.querySelector('.nutrition-card-grid')).gridTemplateColumns : null };
  });
  assert.ok(metrics.scrollWidth <= metrics.width + 1, `${screenName} page overflow: ${JSON.stringify(metrics)}`);
  assert.deepEqual(metrics.clipped, [], `${screenName} clipped controls/values`);
  return { screen: screenName, ...metrics };
}
async function position(page, index) {
  const p = positions[index];
  await page.getByRole('heading', { name: `${p.label} · Semana ${p.weekNumber}`, exact: true }).waitFor();
  assert.equal(await page.getByRole('combobox', { name: 'Estágio', exact: true }).inputValue(), p.stageId);
  assert.equal(await page.getByRole('combobox', { name: 'Semana', exact: true }).inputValue(), String(p.weekNumber));
  assert.equal(await page.getByRole('region', { name: 'Produtos da semana' }).count(), 1);
  assert.equal(await page.getByRole('article').count(), 5);
  assert.equal(await page.locator('.calculator-screen table').count(), 0);
  assert.equal(await page.getByRole('heading', { name: 'Plano', level: 2, exact: true }).count(), 1);
}
async function active(page) { return page.evaluate(() => ({ text: document.activeElement.textContent, id: document.activeElement.id, outlineStyle: getComputedStyle(document.activeElement).outlineStyle, outlineWidth: getComputedStyle(document.activeElement).outlineWidth })); }
try {
  for (const settings of [
    { width: 360 }, { width: 640 }, { width: 768 }, { width: 1024 }, { width: 1280 },
    { width: 640, deviceScaleFactor: 2, reflowFrom: 1280, equivalentZoom: '200%' },
    { width: 320, deviceScaleFactor: 2, reflowFrom: 640, equivalentZoom: '200%' },
  ]) {
    const context = await browser.newContext({ viewport: { width: settings.width, height: 900 }, deviceScaleFactor: settings.deviceScaleFactor ?? 1 });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    await page.goto('http://127.0.0.1:3110/', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Começar agora' }).click();
    await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).fill('10');
    await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).fill('2');
    await page.getByRole('button', { name: /Avançar/ }).click();
    await page.getByRole('button', { name: /Avançar/ }).click();
    await position(page, 0);
    const record = { ...settings, measurements: [await measure(page, 'plan')], forward: [], backward: [], keyboard: [] };
    assert.equal(await page.getByRole('button', { name: 'Anterior', exact: true }).isDisabled(), true);
    for (let index = 1; index < positions.length; index++) {
      await page.getByRole('button', { name: 'Próxima', exact: true }).click(); await position(page, index);
      record.forward.push(positions[index]); record.measurements.push(await measure(page, `plan-${index}`));
    }
    assert.equal(await page.getByRole('button', { name: 'Próxima', exact: true }).isDisabled(), true);
    assert.equal((await active(page)).text, 'Anterior');
    for (let index = positions.length - 2; index >= 0; index--) {
      await page.getByRole('button', { name: 'Anterior', exact: true }).click(); await position(page, index); record.backward.push(positions[index]);
    }
    assert.equal((await active(page)).text, 'Próxima');
    // Native selects operate with keyboard; focus survives controlled re-renders.
    await page.getByRole('combobox', { name: 'Semana', exact: true }).focus();
    await page.keyboard.press('End'); await page.keyboard.press('Escape'); await position(page, 7);
    await page.keyboard.press('Shift+Tab'); assert.equal((await active(page)).id, 'viewed-stage');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Escape'); await position(page, 15);
    await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('5'); await position(page, 12);
    // Both boundary directions through keyboard; no submit and focus remains local.
    await page.getByRole('combobox', { name: 'Estágio', exact: true }).selectOption('vegetative');
    await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('8');
    await page.getByRole('button', { name: 'Próxima', exact: true }).focus();
    await page.keyboard.press('Enter'); await position(page, 8); record.keyboard.push(await active(page));
    assert.equal((await active(page)).text, 'Próxima');
    await page.keyboard.press('Shift+Tab'); assert.equal((await active(page)).text, 'Anterior');
    await page.keyboard.press('Space'); await position(page, 7); record.keyboard.push(await active(page));
    assert.equal((await active(page)).text, 'Anterior');
    // Reaching either edge transfers focus to the enabled neighbour.
    for (const [stageId, week, action, fallback, target] of [['vegetative', '2', 'Anterior', 'Próxima', 0], ['flowering', '7', 'Próxima', 'Anterior', 15]]) {
      for (const key of ['Enter', 'Space']) {
        await page.getByRole('combobox', { name: 'Estágio', exact: true }).selectOption(stageId);
        await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption(week);
        await page.getByRole('button', { name: action, exact: true }).focus(); await page.keyboard.press(key); await position(page, target);
        const focus = await active(page); record.keyboard.push({ key, action, ...focus });
        assert.equal(focus.text, fallback); assert.equal(focus.outlineStyle, 'solid'); assert.equal(focus.outlineWidth, '3px');
        await page.keyboard.press('Tab'); assert.ok((await active(page)).text.includes('Fontes e versão'));
        await page.keyboard.press('Shift+Tab'); assert.equal((await active(page)).text, fallback);
      }
    }
    const status = page.getByRole('group', { name: 'Navegação semanal' }).getByRole('status');
    assert.equal(await status.getAttribute('aria-live'), 'polite');
    for (const name of ['Anterior', 'Próxima']) assert.equal(await page.getByRole('button', { name, exact: true }).getAttribute('type'), 'button');
    await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('5'); await position(page, 12);
    const screenshot = `plan-${settings.width}${settings.equivalentZoom ? '-reflow200' : ''}.png`;
    await page.screenshot({ path: destination + screenshot, fullPage: true }); record.screenshot = screenshot;
    await page.getByRole('button', { name: /Avançar/ }).click();
    assert.equal(await page.getByRole('combobox', { name: 'Semana', exact: true }).inputValue(), '5');
    assert.ok((await page.getByRole('region', { name: 'Fertirrigação', exact: true }).textContent()).includes('80 ml'));
    record.measurements.push(await measure(page, 'recipe'));
    await page.getByRole('combobox', { name: 'Estágio', exact: true }).selectOption('vegetative');
    await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('3');
    assert.ok((await page.getByRole('region', { name: 'Pulverização foliar', exact: true }).textContent()).includes('10 ml'));
    await page.getByRole('button', { name: /Avançar/ }).click();
    record.measurements.push(await measure(page, 'summary'));
    const desktop = settings.width >= 1024;
    assert.equal(await page.getByRole('table', { name: 'Consumo por produto no ciclo', exact: true }).count(), desktop ? 1 : 0);
    assert.equal(await page.getByRole('region', { name: 'Totais por produto', exact: true }).count(), desktop ? 0 : 1);
    assert.ok((await page.locator(desktop ? '.totals-table' : '.totals-cards').textContent()).includes('260 g'));
    await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    await page.getByRole('button', { name: 'Voltar', exact: true }).click(); await position(page, 2);
    await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    assert.equal(await page.locator('input[type=checkbox]:checked').count(), 5);
    await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    assert.equal(await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).inputValue(), '10');
    assert.equal(await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).inputValue(), '2');
    report.viewports.push(record); await context.close();
    console.log(`PASS ${settings.width}${settings.equivalentZoom ? ' reflow200' : ''}: cycle, keyboard, plan/recipe/summary, overflow`);
  }
  assert.deepEqual(report.errors, []); report.passed = true;
} catch (error) { report.failure = error.stack; throw error; }
finally { await writeFile(destination + 'browser-smoke.json', JSON.stringify(report, null, 2)); await browser.close(); }
