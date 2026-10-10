import { describe, expect, it } from 'vitest';
import { parseInput } from '@/features/calculator/presentation/parse-input';

describe('numeric draft parser', () => {
  it.each([['0,75', 0.75], ['0.75', 0.75], ['01', 1], ['1.000', 1], [' 10.25 ', 10.25]])('parses volume %s', (raw, value) => {
    expect(parseInput(raw, 'volume')).toEqual({ ok: true, value });
  });
  it.each(['.5', ',5', '1.', '1,', '+1', '-1', '1.234,5', '1e3', '0x10', '1 2', 'texto', 'Infinity'])('rejects volume syntax %s', raw => {
    expect(parseInput(raw, 'volume')).toEqual({ ok: false, code: 'INVALID_NUMBER' });
  });
  it.each(['1.0', '1,0', '1.5', '-1', '1e3', '0x10'])('rejects count syntax %s', raw => {
    expect(parseInput(raw, 'count')).toEqual({ ok: false, code: 'INVALID_COUNT' });
  });
  it.each(['', '  '])('recognizes required %s', raw => {
    expect(parseInput(raw, 'volume')).toEqual({ ok: false, code: 'REQUIRED' });
  });
  it('leaves zero and safe-count validation to the shared domain validator', () => {
    expect(parseInput('0', 'volume')).toEqual({ ok: true, value: 0 });
    expect(parseInput('0', 'count')).toEqual({ ok: true, value: 0 });
    expect(parseInput(' 01 ', 'count')).toEqual({ ok: true, value: 1 });
  });
  it('rejects textual overflow and positive underflow without truncation', () => {
    expect(parseInput('9'.repeat(400), 'volume')).toEqual({ ok: false, code: 'INVALID_NUMBER' });
    expect(parseInput('0.' + '0'.repeat(400) + '1', 'volume')).toEqual({ ok: false, code: 'INVALID_NUMBER' });
  });
});
