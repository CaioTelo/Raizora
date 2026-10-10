import type { ValidationCode } from '@/domain/calculation/types';
export type ParsedNumber = { readonly ok: true; readonly value: number } | { readonly ok: false; readonly code: ValidationCode };
export function parseInput(raw: string, kind: 'volume' | 'count'): ParsedNumber {
  const text = raw.trim();
  if (!text) return { ok: false, code: 'REQUIRED' };
  const grammar = kind === 'volume' ? /^[0-9]+([.,][0-9]+)?$/ : /^[0-9]+$/;
  if (!grammar.test(text)) return { ok: false, code: kind === 'count' ? 'INVALID_COUNT' : 'INVALID_NUMBER' };
  const value = Number(text.replace(',', '.'));
  if (!Number.isFinite(value) || (value === 0 && /[1-9]/.test(text))) return { ok: false, code: 'INVALID_NUMBER' };
  return { ok: true, value };
}
