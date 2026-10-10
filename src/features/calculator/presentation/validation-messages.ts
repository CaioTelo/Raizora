import type { CalculationResponse, ValidationIssue } from '@/domain/calculation/types';

export function validationMessage(issue: ValidationIssue): string {
  switch (issue.code) {
    case 'REQUIRED':
      if (issue.path.endsWith('foliarVolumeLiters')) return 'Informe o volume por preparo foliar para os produtos selecionados.';
      if (issue.path.endsWith('fertigationApplicationsPerWeek')) return 'Informe quantas fertirrigações serão feitas por semana.';
      return 'Informe o volume por preparo da fertirrigação.';
    case 'NON_POSITIVE': return 'O volume deve ser maior que zero.';
    case 'INVALID_NUMBER': return 'Informe um volume válido, com vírgula ou ponto decimal, sem separador de milhar e dentro da capacidade numérica.';
    case 'INVALID_COUNT': return 'Informe um número inteiro a partir de 1, sem casas decimais e dentro da capacidade numérica.';
    case 'EMPTY_SELECTION': return 'Selecione pelo menos um produto para continuar.';
    case 'UNKNOWN_PRODUCT': return 'Produto não disponível neste cronograma.';
    case 'DUPLICATE_ID': return 'Há um item repetido na seleção ou no cronograma.';
    default: return 'O cronograma está indisponível por uma inconsistência nos dados.';
  }
}
export function responseMessage(response: CalculationResponse): string | undefined {
  if (response.status === 'NUMERIC_ERROR') return 'Os valores excedem a capacidade numérica do cálculo. Revise os volumes informados.';
  if (response.status === 'INVALID_SCHEDULE') return 'O plano está indisponível por uma inconsistência no cronograma.';
  return undefined;
}
