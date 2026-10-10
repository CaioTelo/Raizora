import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';
import CalculatorPage from '@/app/calculadora/page';

describe('project foundation', () => {
  it('resolves the application alias in the Node project', () => {
    expect(CalculatorPage).toBeTypeOf('function');
  });

  it('uses the conventional Next.js build', () => {
    expect(nextConfig.output).toBeUndefined();
  });
});
