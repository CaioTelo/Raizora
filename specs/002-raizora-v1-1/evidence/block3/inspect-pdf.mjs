import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
const { createCanvas, loadImage } = require('/tmp/raizora-block3-qa/node_modules/@napi-rs/canvas');
const { getDocument } = await import('/tmp/raizora-block3-qa/node_modules/pdfjs-dist/legacy/build/pdf.mjs');
const destination = fileURLToPath(new URL('./', import.meta.url));
await mkdir(destination + 'pages', { recursive: true });
const report = { method: 'Mozilla PDF.js: all page text, A4 media boxes, text bounding boxes, contextual repeated headers and raster images', documents: [], passed: false };
const texts = new Map(); const rasterHashes = new Map();
try {
  for (const name of ['complete-vegetative1', 'complete-flowering4', 'subset-decimal', 'incomplete', 'long-many', 'subcent']) {
    const loadingTask = getDocument({ data: new Uint8Array(await readFile(destination + name + '.pdf')), standardFontDataUrl: '/tmp/raizora-block3-qa/node_modules/pdfjs-dist/standard_fonts/' });
    const pdf = await loadingTask.promise;
    const record = { name, pages: pdf.numPages, measurements: [], contactSheets: [] }; const pageTexts = []; const pngPaths = []; const rowHeaders = []; const pageHashes = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n); const viewport = page.getViewport({ scale: 1 }); const content = await page.getTextContent();
      const items = content.items.filter(i => 'str' in i && i.str.trim()); rowHeaders.push(...items.filter(i => i.transform[4] > 38 && i.transform[4] < 40 && ['Joker','Coringa Blend','Plant Protein','Terpeno Plus','Tricomax'].some(p => i.str.startsWith(p))).map(i => i.str));
      const text = items.map(i => i.str).join(' ').replace(/\s+/g, ' '); pageTexts.push(text);
      assert.ok(Math.abs(viewport.width - 595.28) < 1 && Math.abs(viewport.height - 841.89) < 1, `${name} page ${n} is not A4 portrait`);
      const clipped = items.filter(i => i.transform[4] < 33 || i.transform[4] + i.width > viewport.width - 33 || i.transform[5] + (content.styles[i.fontName].descent ?? -0.25) * i.height < 33 || i.transform[5] + (content.styles[i.fontName].ascent ?? 0.9) * i.height > viewport.height - 33);
      assert.deepEqual(clipped.map(i => i.str), [], `${name} page ${n} text outside printable margins`);
      const headings = text.match(/(?:Vegetativo|Floração) · Semana \d+/g) ?? [];
      const repeatedHeaders = text.match(/RAIZORA · Plano de Nutrição completo/g) ?? [];
      record.measurements.push({ page: n, width: viewport.width, height: viewport.height, textItems: items.length, headings, repeatedHeaders: repeatedHeaders.length, clipped: clipped.length, minTextX: Math.min(...items.map(i => i.transform[4])), maxTextX: Math.max(...items.map(i => i.transform[4] + i.width)) });
      const view = page.getViewport({ scale: 1.4 }); const canvas = createCanvas(Math.ceil(view.width), Math.ceil(view.height));
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: view }).promise;
      const path = destination + `pages/${name}-${n}.png`; const png = canvas.toBuffer('image/png'); pageHashes.push(createHash('sha256').update(png).digest('hex')); await writeFile(path, png); pngPaths.push(path); page.cleanup();
    }
    rasterHashes.set(name, pageHashes); record.productRowHeaders = rowHeaders.length; const expectedRows = name === 'long-many' ? 340 : name === 'subset-decimal' ? 17 : 85; assert.equal(rowHeaders.length, expectedRows, name + ': omitted/duplicated product rows');
    const allText = pageTexts.join('\n'); texts.set(name, allText);
    const headingSequence = [...allText.matchAll(/(?:Vegetativo|Floração) · Semana \d+/g)].map(m => m[0]);
    const unique = headingSequence.filter((h, i) => i === 0 || h !== headingSequence[i - 1]);
    const expected = ['Vegetativo', 'Floração'].flatMap(s => Array.from({ length: 8 }, (_, i) => `${s} · Semana ${i + 1}`));
    assert.deepEqual(unique, expected, `${name}: complete chronological coverage`);
    for (const control of ['Avançar', 'Anterior', 'Próxima', 'Imprimir plano completo', 'Interface de teste temporária']) assert.ok(!allText.includes(control), `${name} interactive content in PDF`);
    assert.ok(allText.includes('SRC-001') && allText.includes('Versão do fabricante: não informada') && allText.includes('16 semanas'));
    // Contact sheets include every page, at most eight per sheet; full resolution PNGs also retained.
    for (let offset = 0; offset < pngPaths.length; offset += 8) {
      const batch = pngPaths.slice(offset, offset + 8); const canvas = createCanvas(840, 630 * Math.ceil(batch.length / 2)); const c = canvas.getContext('2d'); c.fillStyle = '#ddd'; c.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < batch.length; i++) { const img = await loadImage(batch[i]); c.drawImage(img, (i % 2) * 420 + 10, Math.floor(i / 2) * 630 + 20, 400, 566); c.fillStyle = '#000'; c.font = '14px sans-serif'; c.fillText(`${name}: página ${offset + i + 1}`, (i % 2) * 420 + 10, Math.floor(i / 2) * 630 + 608); }
      const filename = `${name}-contact-${offset / 8 + 1}.png`; await writeFile(destination + filename, canvas.toBuffer('image/png')); record.contactSheets.push(filename);
    }
    await writeFile(destination + name + '.txt', allText); report.documents.push(record); await loadingTask.destroy();
  }
  assert.equal(texts.get('complete-vegetative1'), texts.get('complete-flowering4'), 'PDF text depends on active week');
  assert.deepEqual(rasterHashes.get('complete-vegetative1'), rasterHashes.get('complete-flowering4'), 'PDF raster pages depend on active week');
  for (const total of ['260 g', '160 ml', '596 ml', '32 ml', '100 g']) assert.ok(texts.get('complete-flowering4').includes(total));
  assert.ok(texts.get('incomplete').includes('Subtotal conhecido (parcial): 240 g') && !texts.get('incomplete').includes('260 g'));
  assert.ok(texts.get('subcent').includes('< 0,01 g') && texts.get('subcent').includes('< 0,01 L') && !/(?<![\d,])0 L/.test(texts.get('subcent'))); assert.ok(texts.get('subset-decimal').includes('10,25 g') && !texts.get('subset-decimal').includes('Plant Protein'));
  assert.ok(texts.get('long-many').includes('FIM-REFERENCIA-SRC-007'));
  report.passed = true;
} catch (error) { report.failure = error.stack; throw error; }
finally { await writeFile(destination + 'pdf-inspection.json', JSON.stringify(report, null, 2)); }
console.log(report.documents.map(d => `${d.name}: ${d.pages} A4 pages`).join('\n'));
