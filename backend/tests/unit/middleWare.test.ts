import { afterAll, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

import { adminAuthMiddleware } from '../../src/middlewares/admin.middleware';
import pool from "../../src/config/database";

describe("adminAuthMiddleware", () => {
  let req: any; // <-- make this 'any' to bypass type errors in tests
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { session: {} }; // you can freely set 'session' now
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
  });

  afterAll(async () => {
    await pool.end(); // Close DB connection once
    // If you have an actual server instance:
    // await new Promise(resolve => server.close(resolve));
  });

  test("calls next if session role is admin", () => {
    req.session.role = "admin";

    adminAuthMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("returns 401 if session is missing or not admin", () => {
    req.session.role = "user"; // not admin

    adminAuthMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized - Admin only",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
