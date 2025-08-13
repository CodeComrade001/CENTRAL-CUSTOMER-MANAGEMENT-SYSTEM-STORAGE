// tests/admin.controller.unit.test.ts
import request from "supertest";
import express from "express";
import { beforeAll, afterEach, describe, expect, jest, test } from "@jest/globals";

import AdminRoute from "../../src/modules/admin/admin.routes";
import AdminImplementation from "../../src/modules/admin/admin.service";
import {
  customerAccess,
  loginInAdmin,
  packageUpdate,
  slotUpdate,
} from "../../src/modules/admin/admin.model";

// NOTE: adjust import paths above if your project folder structure differs.

describe("AdminController (unit)", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Middleware to inject a fake session for signout tests (controller expects req.session & req.sessionID)
    app.use((req: any, res, next) => {
      // sessionID used by adminSignOut
      req.sessionID = "test-sid-123";
      // session.destroy(...) is expected by delete__adminSignOut
      req.session = {
        destroy: (cb: (err?: any) => void) => cb(undefined),
      } as any;
      next();
    });

    // mount your admin router under /admin just like your app does
    app.use("/admin", new AdminRoute().getRouter());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  //
  // POST /admin/login (post__adminSignIn)
  //
  // test("POST /admin/login -> success (valid payload + service returns message)", async () => {
  //   // Mock validation -> succeed (controller expects validationResult.success === true)
  //   jest.spyOn(loginInAdmin as any, "safeParseAsync").mockResolvedValueOnce({
  //     success: true,
  //     data: { /* put valid login payload fields here later */ },
  //   } as any);

  //   // Mock service adminSignIn to return id + message
  //   jest
  //     .spyOn(AdminImplementation.prototype, "adminSignIn")
  //     .mockResolvedValueOnce({ id: "1", message: "OK" } as any);

  //   const res = await request(app)
  //     .post("/admin/login")
  //     .send({ /* valid payload here (you said you'll add it) */ });

  //   expect(res.status).toBe(200);
  //   expect(res.body).toEqual({ message: "authorised user" });
  //   expect(AdminImplementation.prototype.adminSignIn).toHaveBeenCalled();
  // });

  test("POST /admin/login -> validation failure returns 400", async () => {
    jest.spyOn(loginInAdmin as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({ /* validation issues */ }) },
    } as any);

    const res = await request(app).post("/admin/login").send({ /* invalid payload */ });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  test("POST /admin/login -> unauthorized when service returns no message", async () => {
    jest.spyOn(loginInAdmin as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "adminSignIn")
      .mockResolvedValueOnce({ id: null, message: "" } as any);

    const res = await request(app).post("/admin/login").send({ /* valid payload */ });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorised user");
  });

  //
  // DELETE /admin/signout (delete__adminSignOut)
  //
  test("DELETE /admin/signout -> success clears cookie and returns 200", async () => {
    // adminSignOut should return truthy (controller checks `del && destroyed`)
    jest
      .spyOn(AdminImplementation.prototype, "adminSignOut")
      .mockResolvedValueOnce(true as any);

    // since we injected req.session.destroy middleware earlier to call cb(undefined),
    // controller will treat destroyed === true

    const res = await request(app).delete("/admin/signout");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Log Out successful" });
    expect(AdminImplementation.prototype.adminSignOut).toHaveBeenCalledWith("test-sid-123");
  });

  test("DELETE /admin/signout -> service throws -> returns 500", async () => {
    jest
      .spyOn(AdminImplementation.prototype, "adminSignOut")
      .mockRejectedValueOnce(new Error("DB fail"));

    const res = await request(app).delete("/admin/signout");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal Server Error");
  });

  /*//////////////////////////////////////////////////////////////
  GET_Request /admin/sms/all, /admin/cbt/all, /admin/hms/all == for valid db connection and no errors
      //////////////////////////////////////////////////////////////*/

  //No Error
  test("GET /admin/sms/all -> returns rows from service", async () => {
    const mock = { customer_id: "sch_x" } as any;
    jest
      .spyOn(AdminImplementation.prototype, "fetchAllCustomersForSMS")
      .mockResolvedValueOnce({ rows: [mock] } as any);

    const res = await request(app).get("/admin/sms/all");
    expect(res.status).toBe(200);
    expect(res.body.rows).toEqual([mock]);
  });

  test("GET /admin/cbt/all -> returns rows from service", async () => {
    const mock = { customer_id: "cbt_x" } as any;
    jest
      .spyOn(AdminImplementation.prototype, "fetchAllCustomersForCBT")
      .mockResolvedValueOnce({ rows: [mock] } as any);

    const res = await request(app).get("/admin/cbt/all");
    expect(res.status).toBe(200);
    expect(res.body.rows).toEqual([mock]);
  });

  test("GET /admin/hms/all -> returns rows from service", async () => {
    const mock = { customer_id: "hms_x" } as any;
    jest
      .spyOn(AdminImplementation.prototype, "fetchAllCustomersForHMS")
      .mockResolvedValueOnce({ rows: [mock] } as any);

    const res = await request(app).get("/admin/hms/all");
    expect(res.status).toBe(200);
    expect(res.body.rows).toEqual([mock]);
  });

  /*//////////////////////////////////////////////////////////////
  GET_Request /admin/sms/all, /admin/cbt/all, /admin/hms/all == for invalid db connection and errors
      //////////////////////////////////////////////////////////////*/

  test("GET /admin/sms/all -> returns 500 if DB query fails", async () => {
    jest
      .spyOn(AdminImplementation.prototype, "fetchAllCustomersForSMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).get("/admin/sms/all");

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });
  test("GET /admin/hms/all -> returns 500 if DB query fails", async () => {
    jest
      .spyOn(AdminImplementation.prototype, "fetchAllCustomersForHMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).get("/admin/hms/all");

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });
  test("GET /admin/cbt/all -> returns 500 if DB query fails", async () => {
    jest
      .spyOn(AdminImplementation.prototype, "fetchAllCustomersForCBT")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).get("/admin/cbt/all");

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });



  /*//////////////////////////////////////////////////////////////
                         PATCH /admin/sms/verify
      //////////////////////////////////////////////////////////////*/

  test("PATCH /admin/sms/verify -> success when validation ok and service truthy", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { customer_id: 'sch_1', status: true },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "changeCustomerAccesForSMS")
      .mockResolvedValueOnce({ rowCount: 1 } as any);

    const res = await request(app)
      .patch("/admin/sms/verify")
      .send({ customer_id: 'sch_1', status: true });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: expect.any(String) });
  });

  test("PATCH /admin/sms/verify -> validation failure returns 400", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({}) },
    } as any);

    const res = await request(app)
      .patch("/admin/sms/verify")
      .send({ /* invalid payload */ });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  test("PATCH /admin/sms/verify -> DB error returns  500", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      error: { format: () => ({}) },
    } as any);
    jest
      .spyOn(AdminImplementation.prototype, "changeCustomerAccesForSMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).patch("/admin/sms/verify").send({/**payload */ });

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  /*//////////////////////////////////////////////////////////////
                       PATCH /admin/hms/verify
    //////////////////////////////////////////////////////////////*/

  test("PATCH /admin/hms/verify -> success", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { customer_id: 'hms_1', status: true },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "changeCustomerAccesForHMS")
      .mockResolvedValueOnce({ rowCount: 1 } as any);

    const res = await request(app)
      .patch("/admin/hms/verify")
      .send({ customer_id: 'hms_1', status: true });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: expect.any(String) });
  });

  test("PATCH /admin/hms/verify -> validation failure returns 400", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({}) },
    } as any);

    const res = await request(app)
      .patch("/admin/hms/verify")
      .send({ /* invalid payload */ });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  test("PATCH /admin/hms/verify -> DB error returns  500", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      error: { format: () => ({}) },
    } as any);
    jest
      .spyOn(AdminImplementation.prototype, "changeCustomerAccesForHMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).patch("/admin/hms/verify").send({/**payload */ });

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  /*//////////////////////////////////////////////////////////////
                         PATCH /admin/cbt/verify
      //////////////////////////////////////////////////////////////*/

  test("PATCH /admin/cbt/verify -> success", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { customer_id: 'cbt_1', status: true },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "changeCustomerAccesForCBT")
      .mockResolvedValueOnce({ rowCount: 1 } as any);

    const res = await request(app)
      .patch("/admin/cbt/verify")
      .send({ customer_id: 'cbt_1', status: true });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: expect.any(String) });
  });

  test("PATCH /admin/cbt/verify -> validation failure returns 400", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({}) },
    } as any);

    const res = await request(app)
      .patch("/admin/cbt/verify")
      .send({ /* invalid payload */ });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });

  test("PATCH /admin/cbt/verify -> DB error returns  500", async () => {
    jest.spyOn(customerAccess as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      error: { format: () => ({}) },
    } as any);
    jest
      .spyOn(AdminImplementation.prototype, "changeCustomerAccesForCBT")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).patch("/admin/cbt/verify").send({/**payload */ });

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  /*//////////////////////////////////////////////////////////////
                     PATCH /admin/hms/update-package
      //////////////////////////////////////////////////////////////*/
  test("PATCH /admin/hms/update-package -> success when payload valid", async () => {
    jest.spyOn(packageUpdate as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { customer_id: "hms_1", newPackage: "starter" },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "updateCustomerPackageForHMS")
      .mockResolvedValueOnce({ rowCount: 1 } as any);

    const res = await request(app)
      .patch("/admin/hms/package")
      .send({ customer_id: "hms_1", newPackage: "starter" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: expect.any(String) });
  });
  test("PATCH /admin/hms/update-package ->  validation failure returns 400", async () => {
    jest.spyOn(packageUpdate as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({}) },
    } as any);


    const res = await request(app)
      .patch("/admin/hms/package")
      .send({ customer_id: "hms_1", newPackage: "starter" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });
  test("PATCH /admin/hms/update-package -> db failure  return 500", async () => {
    jest.spyOn(packageUpdate as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      error: { format: () => ({}) },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "updateCustomerPackageForHMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app)
      .patch("/admin/hms/package")
      .send({ customer_id: "hms_1", newPackage: "starter" });

    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: expect.any(String) });
  });

  /*//////////////////////////////////////////////////////////////
                   PATCH /admin/sms/update-package
    //////////////////////////////////////////////////////////////*/

  test("PATCH /admin/sms/update-package -> validation failure returns 400", async () => {
    jest.spyOn(packageUpdate as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({}) },
    } as any);

    const res = await request(app)
      .patch("/admin/sms/package")
      .send({ customer_id: "hms_1", newPackage: "basic" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });


  test("PATCH /admin/cbt/update-slot -> validation success returns 200", async () => {
    jest.spyOn(slotUpdate as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { customer_id: "cbt_12", newSlot: 20 },
    } as any);

    jest
      .spyOn(AdminImplementation.prototype, "updateCustomerSlotForCBT")
      .mockResolvedValueOnce({ rowCount: 1 } as any);

    const res = await request(app)
      .patch("/admin/cbt/slot")
      .send({ customer_id: "cbt_12", newSlot: 20 });

    expect(res.status).toBe(200);
  });

  test("PATCH /admin/cbt/update-slot -> validation failure returns 400", async () => {
    jest.spyOn(slotUpdate as any, "safeParseAsync").mockResolvedValueOnce({
      success: false,
      error: { format: () => ({}) },
    } as any);

    const res = await request(app)
      .patch("/admin/cbt/slot")
      .send({ /* invalid payload */ });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Validation failed");
  });
});
