import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(process.cwd() + '/package.json');
const { build } = require('/tmp/raizora-block3-qa/node_modules/esbuild');
await mkdir('/tmp/raizora-v11-print-qa', { recursive: true });
await build({
  stdin: { resolveDir: process.cwd(), sourcefile: 'print-qa.tsx', loader: 'tsx', contents: `
    import { renderToStaticMarkup } from 'react-dom/server';
    import { writeFileSync } from 'node:fs';
    import { PrintPlan } from './src/features/calculator/components/PrintPlan';
    import { plantasQueCuram } from './src/data/brands/plantas-que-curam/brand';
    import { applicationResultFor, feedingSchedule, incompleteSchedule } from './tests/ui/result-fixtures';
    const longSchedule = {
      ...feedingSchedule,
      products: Array.from({ length: 4 }, (_, i) => feedingSchedule.products.map(p => ({ ...p, id: p.id + '-qa-' + i, name: p.name + ' — produto sintético de QA com identificação extensa, lote de referência ' + i }))).flat(),
      rules: Array.from({ length: 4 }, (_, i) => feedingSchedule.rules.map(r => ({ ...r, productId: r.productId + '-qa-' + i }))).flat(),
      metadata: { ...feedingSchedule.metadata, sources: feedingSchedule.metadata.sources.map(s => ({ ...s, title: s.title + ' — ' + 'Referência sintética de QA para validar continuidade de texto extenso. '.repeat(6), reference: s.reference + ' / ' + 'documento-longo-'.repeat(12) + 'FIM-REFERENCIA-' + s.id })) }
    };
    const cases = [
      ['incomplete', incompleteSchedule(), null],
      ['long-many', longSchedule, null],
      ['subcent', feedingSchedule, applicationResultFor(feedingSchedule, undefined, { fertigationVolumeLiters: 0.001, foliarVolumeLiters: 0.001 })]
    ];
    for (const [name, schedule, given] of cases) {
      const result = given ?? applicationResultFor(schedule);
      writeFileSync('/tmp/raizora-v11-print-qa/' + name + '.html', renderToStaticMarkup(<main className="app-shell has-print-plan"><div className="calculator-screen">Interface de teste temporária</div><PrintPlan result={result} schedule={schedule} brand={plantasQueCuram} /></main>));
      writeFileSync('/tmp/raizora-v11-print-qa/' + name + '.json', JSON.stringify({ schedule, result }));
    }
  ` },
  bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
  outfile: '/tmp/raizora-v11-print-qa/render.cjs',
});
require('/tmp/raizora-v11-print-qa/render.cjs');
console.log('Generated temporary QA HTML from production PrintPlan and existing engine: incomplete, long-many (20 synthetic products), subcent.');
