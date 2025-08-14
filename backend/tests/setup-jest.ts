// tests/setup-jest.ts
import { jest } from '@jest/globals';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock pg
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock database.ts to return our mockQuery
const mockQuery = jest.fn();
jest.mock('../src/config/database', () => ({
  connectToPostgres: jest.fn(() => ({ query: mockQuery })),
}));





export { mockQuery };
