import { afterAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

import { adminAuthMiddleware } from '../../src/middlewares/admin.middleware';
import pool from "../../src/config/database";

describe("adminAuthMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    // keep the test-side session simple
    req = { session: {} } as any;

    // CRITICAL: status must return `this` so `res.status(...).json(...)` chaining works.
    res = {
      status: jest.fn().mockReturnThis(), // <-- important
      json: jest.fn(),
    } as any;

    next = jest.fn();
  });

  test("returns 401 if session is missing", () => {
    (req as any).session = undefined;

    adminAuthMiddleware(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized - Admin only" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 if session role is not admin", () => {
    (req as any).session = { role: "user" };

    adminAuthMiddleware(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized - Admin only" });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next if session role is admin", () => {
    (req as any).session = { role: "admin" };

    adminAuthMiddleware(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
