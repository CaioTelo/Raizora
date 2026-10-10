import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url); const { chromium } = require('/tmp/raizora-block2-browser/node_modules/playwright');
const destination = fileURLToPath(new URL('./', import.meta.url));
const report = { method: 'Headed Chromium native print preview via chrome://print, cancel using native preview button, app session comparison', passed: false };
const browser = await chromium.launch({ headless: false, args: ['--window-size=1280,1000'] });
try {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.goto('http://127.0.0.1:3106/calculadora');
  await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).fill('10');
  await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).fill('2');
  await page.getByRole('button', { name: /Avançar/ }).click(); await page.getByRole('button', { name: /Avançar/ }).click();
  await page.getByRole('combobox', { name: 'Estágio', exact: true }).selectOption('flowering'); await page.getByRole('combobox', { name: 'Semana', exact: true }).selectOption('4');
  const before = await page.locator('.print-plan').innerHTML();
  const session = await browser.newBrowserCDPSession();
  const clickPromise = page.getByRole('button', { name: 'Imprimir plano completo', exact: true }).click({ noWaitAfter: true, timeout: 20000 });
  // The native preview blocks completion of the input event until cancel; observe it concurrently.
  clickPromise.catch(() => {});
  let target;
  for (let i = 0; i < 40; i++) {
    target = (await session.send('Target.getTargets')).targetInfos.find(t => t.url.startsWith('chrome://print'));
    if (target) break;
    await new Promise(r => setTimeout(r, 250));
  }
  assert.ok(target, 'native print preview target was not opened'); report.target = { url: target.url, type: target.type };
  const { sessionId } = await session.send('Target.attachToTarget', { targetId: target.targetId, flatten: false });
  let sequence = 0;
  function send(method, params = {}) {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { session.off('Target.receivedMessageFromTarget', receive); reject(new Error('CDP timeout ' + method)); }, 15000);
      function receive(event) {
        if (event.sessionId !== sessionId) return;
        const message = JSON.parse(event.message); if (message.id !== id) return;
        clearTimeout(timer); session.off('Target.receivedMessageFromTarget', receive);
        if (message.error) reject(new Error(JSON.stringify(message.error))); else resolve(message.result);
      }
      session.on('Target.receivedMessageFromTarget', receive);
      session.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id, method, params }) }).catch(reject);
    });
  }
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
  const collect = `function deep(root, selector) { const found = [...root.querySelectorAll(selector)]; for (const e of root.querySelectorAll('*')) if (e.shadowRoot) found.push(...deep(e.shadowRoot, selector)); return found; }`;
  for (let i = 0; i < 30; i++) {
    const ready = await evaluate(`(() => { ${collect} return deep(document, 'cr-button.cancel-button').length > 0; })()`);
    if (ready) break; await new Promise(r => setTimeout(r, 250));
  }
  report.settings = await evaluate(`(() => { ${collect} return deep(document, 'select').map(e => ({id:e.id,value:e.value,options:[...e.options].map(o=>({text:o.text,value:o.value}))})); })()`);
  // Choose A4 in the native preview when a paper selector is exposed; CSS already requests A4.
  await evaluate(`(() => { ${collect} const e = deep(document, 'select').find(e => [...e.options].some(o => o.text.includes('A4'))); if (e) { e.value = [...e.options].find(o=>o.text.includes('A4')).value; e.dispatchEvent(new Event('change', {bubbles:true})); } })()`);
  await evaluate(`(() => { ${collect} const header = deep(document, 'cr-checkbox').find(e => e.textContent.includes('Headers and footers')); if (header?.checked) header.click(); })()`);
  report.finalSettings = await evaluate(`(() => { ${collect} return {paper:deep(document,'select').find(e=>[...e.options].some(o=>o.text.includes('A4')))?.value,checkboxes:deep(document,'cr-checkbox').map(e=>({label:e.textContent.trim(),checked:e.checked}))}; })()`);
  await new Promise(r => setTimeout(r, 1500));
  report.previewText = await evaluate(`(() => { ${collect} return deep(document, '*').filter(e=>e.shadowRoot).map(e=>e.shadowRoot.textContent).join(' ').replace(/\\s+/g,' ').slice(0,18000); })()`);
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(destination + 'native-preview.png', Buffer.from(screenshot.data, 'base64'));
  await evaluate(`(() => { ${collect} const button = deep(document, 'cr-button.cancel-button')[0]; if (!button) throw new Error('native cancel button absent'); button.click(); return true; })()`);
  await clickPromise;
  await page.bringToFront();
  assert.equal(await page.getByRole('combobox', { name: 'Semana', exact: true }).inputValue(), '4');
  assert.equal(await page.getByRole('combobox', { name: 'Estágio', exact: true }).inputValue(), 'flowering');
  assert.equal(await page.locator('.print-plan').innerHTML(), before);
  await page.getByRole('button', { name: 'Voltar', exact: true }).click(); assert.equal(await page.locator('input[type=checkbox]:checked').count(), 5);
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  assert.equal(await page.getByRole('textbox', { name: 'Volume por preparo da fertirrigação', exact: true }).inputValue(), '10'); assert.equal(await page.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar', exact: true }).inputValue(), '2');
  report.passed = true;
} catch (error) { report.failure = error.stack; console.log(error.stack); }
finally { await writeFile(destination + 'native-preview.json', JSON.stringify(report, null, 2)); await browser.close(); }
