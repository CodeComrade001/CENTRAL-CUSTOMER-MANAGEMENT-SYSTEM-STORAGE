// tests/utils/test-utils.ts
import * as bcrypt from 'bcrypt';
import { jest } from '@jest/globals';

export const mockBcrypt = {
  setCompare: (v: boolean) => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(v as never);
  },
  setCompareOnce: (v: boolean) => {
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(v as never);
  },
  setHashOnce: (val: string) => {
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(val as never);
  },
  clear: () => {
    (bcrypt.compare as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
  },
};
