import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url); const { chromium } = require('/tmp/raizora-block2-browser/node_modules/playwright');
const destination = fileURLToPath(new URL('./', import.meta.url));
const report = { method: 'Headed Chromium native print preview via chrome://print, cancel using native preview button, app session comparison', passed: false };
const browser = await chromium.launch({ headless: false, args: ['--window-size=1280,1000','--ozone-platform=x11'] });
try {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.goto('http://127.0.0.1:3110/calculadora');
  await page.getByRole('textbox',{name:'Volume por preparo da fertirrigação',exact:true}).fill('10');
  await page.getByRole('textbox',{name:'Volume por preparo da pulverização foliar',exact:true}).fill('2');
  await page.getByRole('button',{name:/Avançar/}).click();await page.getByRole('button',{name:/Avançar/}).click();
  await page.getByRole('combobox',{name:'Estágio',exact:true}).selectOption('flowering');await page.getByRole('combobox',{name:'Semana',exact:true}).selectOption('4');
  const before=await page.locator('.print-plan').innerHTML();
  const session = await browser.newBrowserCDPSession();
  const clickPromise = page.getByRole('button',{name:'Imprimir plano completo',exact:true}).click({noWaitAfter:true});
  // The native preview blocks completion of the input event until cancel; observe it concurrently.
  clickPromise.catch(() => {});
  let target;
  for (let i = 0; i < 40; i++) {
    target = (await session.send('Target.getTargets')).targetInfos.find(t => t.url.startsWith('chrome://print'));
    if (target) break;
    await new Promise(r => setTimeout(r, 250));
  }
  assert.ok(target, 'native print preview target was not opened'); report.target = { url: target.url, type: target.type };
  let { sessionId } = await session.send('Target.attachToTarget', { targetId: target.targetId, flatten: false });
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
  await new Promise(r=>setTimeout(r,2500));
  report.state=await evaluate(`(() => { ${collect} const app=document.querySelector('print-preview-app'); return {state:app.state,settings:['mediaSize','layout','scaling','headerFooter','cssBackground'].map(k=>({key:k,value:app.getSettingValue?.(k)})),visibleError:deep(document,'*').filter(e=>e.textContent?.trim()==='Print preview failed.'&&e.getBoundingClientRect().width>0).map(e=>e.textContent)}; })()`);
  const screenshot=await send('Page.captureScreenshot',{format:'png'}); await writeFile(destination+'native-attempts.png',Buffer.from(screenshot.data,'base64'));
  await evaluate(`(() => { ${collect} const b=deep(document,'cr-button.cancel-button')[0]; setTimeout(()=>b.click(),0); return true; })()`);
  await clickPromise; assert.equal(await page.locator('.print-plan').innerHTML(),before); assert.equal(await page.getByRole('combobox',{name:'Semana',exact:true}).inputValue(),'4'); report.cancellationPreservesSession=true;
  // A second native preview opened with the actual keyboard shortcut, then concluded via Save.
  report.nativeShortcut=JSON.parse(execFileSync('python3',['specs/002-raizora-v1-1/evidence/block4/x11-save.py','--ctrlp'],{encoding:'utf8'}));
  let shortcutTarget;
  for (let i=0;i<40;i++) { shortcutTarget=(await session.send('Target.getTargets')).targetInfos.find(t=>t.url.startsWith('chrome://print')); if(shortcutTarget) break; await new Promise(r=>setTimeout(r,250)); }
  assert.ok(shortcutTarget,'Ctrl+P did not open native preview');
  const shortcutAttachment=await session.send('Target.attachToTarget',{targetId:shortcutTarget.targetId,flatten:false});
  // Reuse the connection helper with the new preview target session.
  sessionId=shortcutAttachment.sessionId;
  for(let i=0;i<40;i++) { if(await evaluate(`(() => { ${collect} return deep(document,'cr-button.action-button').some(e=>!e.disabled); })()`)) break; await new Promise(r=>setTimeout(r,250)); }
  report.shortcutState=await evaluate(`(() => { const app=document.querySelector('print-preview-app'); return {state:app.state,destination:app.destination?.id,settings:['mediaSize','layout','scaling','scalingType','headerFooter','cssBackground'].map(k=>({key:k,value:app.getSettingValue?.(k)}))}; })()`);
  await evaluate(`(() => { ${collect} for(const label of ['Headers and footers','Background graphics']) { const e=deep(document,'cr-checkbox').find(e=>e.textContent.includes(label)); if(e?.checked)e.click(); } return true; })()`);
  await new Promise(r=>setTimeout(r,2000));
  const shortcutScreenshot=await send('Page.captureScreenshot',{format:'png'}); await writeFile(destination+'native-ctrlp-preview.png',Buffer.from(shortcutScreenshot.data,'base64'));
  report.savedSettings=await evaluate(`(() => { const app=document.querySelector('print-preview-app'); return {state:app.state,destination:app.destination?.id,settings:['mediaSize','layout','scaling','scalingType','headerFooter','cssBackground'].map(k=>({key:k,value:app.getSettingValue?.(k)}))}; })()`);
  const savePromise=evaluate(`(() => { ${collect} const button=deep(document,'cr-button.action-button').find(e=>!e.disabled); if(!button) throw new Error('Save action disabled'); setTimeout(()=>button.click(),0); return true; })()`); savePromise.catch(()=>{});
  await new Promise(r=>setTimeout(r,1500));
  report.nativeSave=JSON.parse(execFileSync('python3',['specs/002-raizora-v1-1/evidence/block4/x11-save.py',destination+'native-saved.pdf'],{encoding:'utf8'}));
  await savePromise;
  for(let i=0;i<40;i++){ if(!(await session.send('Target.getTargets')).targetInfos.some(t=>t.url.startsWith('chrome://print'))) break; await new Promise(r=>setTimeout(r,250)); }
  await page.bringToFront();
  assert.equal(await page.getByRole('combobox',{name:'Semana',exact:true}).inputValue(),'4'); assert.equal(await page.locator('.print-plan').innerHTML(),before);
  report.CtrlPAndSavePreserveSession=true;

  await page.getByRole('button',{name:'Voltar',exact:true}).click();assert.equal(await page.locator('input[type=checkbox]:checked').count(),5);await page.getByRole('button',{name:'Voltar',exact:true}).click();assert.equal(await page.getByRole('textbox',{name:'Volume por preparo da fertirrigação',exact:true}).inputValue(),'10');assert.equal(await page.getByRole('textbox',{name:'Volume por preparo da pulverização foliar',exact:true}).inputValue(),'2');report.passed=true;
} catch(error) { report.failure=error.stack; }
finally { await writeFile(destination+'native-attempts.json',JSON.stringify(report,null,2)); await browser.close(); }
