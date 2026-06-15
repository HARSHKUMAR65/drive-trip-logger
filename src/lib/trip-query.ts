export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;

export function normalizePageSize(value: number): number {
  return Math.min(Math.max(value, 1), MAX_PAGE_SIZE);
}
