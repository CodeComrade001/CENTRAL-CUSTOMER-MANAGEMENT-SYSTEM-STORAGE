// tests/mocks/db.ts
import { jest } from '@jest/globals';

export function createMockDb() {
  const mockQuery = jest.fn();
  return { query: mockQuery };
}
