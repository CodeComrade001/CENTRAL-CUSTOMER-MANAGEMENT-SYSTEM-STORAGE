import request from "supertest";
import express from "express";
import { beforeAll, afterEach, describe, expect, jest, test, afterAll } from "@jest/globals";
import UserRoute from '../../src/modules/user/user.routes';
import UserImplementation from "../../src/modules/user/user.service";
import { validateCBT, validateHMS, validateSMS } from "../../src/modules/user/user.model";
import pool from "../../src/config/database";

describe("userController (unit)", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.use("/user", new UserRoute().getRouter());
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await pool.end(); // Close DB connection once
    // If you have an actual server instance:
    // await new Promise(resolve => server.close(resolve));
  });
  /*//////////////////////////////////////////////////////////////
                          POST /user/signup/sms
      //////////////////////////////////////////////////////////////*/

  test("POST /user/signup/sms -> Account has been created successfully return 200", async () => {
    jest.spyOn(validateSMS as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForSMS")
      .mockResolvedValueOnce({ message: true } as any);

    const res = await request(app).post("/user/signup/sms").send({ /* valid payload */ });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Account has been created successfully");
    expect(UserImplementation.prototype.fetchUserSignUpForSMS).toHaveBeenCalled();
  });

  test("POST /user/signup/sms -> Account was not created successfully return 400", async () => {
    jest.spyOn(validateSMS as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForSMS")
      .mockResolvedValueOnce({ message: false } as any);

    const res = await request(app).post("/user/signup/sms").send({ /* valid payload */ });
    expect(res.status).toBe(400);
    expect(UserImplementation.prototype.fetchUserSignUpForSMS).toHaveBeenCalled();
  });
  test("POST /user/signup/sms ->service file error return 500", async () => {
    jest.spyOn(validateSMS as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForSMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).post("/user/signup/sms").send({ /* valid payload */ });
    expect(res.status).toBe(500);
    expect(UserImplementation.prototype.fetchUserSignUpForSMS).toHaveBeenCalled();
  });

  /*//////////////////////////////////////////////////////////////
                          POST /user/signup/hms
      //////////////////////////////////////////////////////////////*/

  test("POST /user/signup/hms -> Account has been created successfully return 200", async () => {
    jest.spyOn(validateHMS as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForHMS")
      .mockResolvedValueOnce({ message: true } as any);

    const res = await request(app).post("/user/signup/hms").send({ /* valid payload */ });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Account has been created successfully");
    expect(UserImplementation.prototype.fetchUserSignUpForHMS).toHaveBeenCalled();
  });

  test("POST /user/signup/hms -> Account was not created successfully return 400", async () => {
    jest.spyOn(validateHMS as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForHMS")
      .mockResolvedValueOnce({ message: false } as any);

    const res = await request(app).post("/user/signup/hms").send({ /* valid payload */ });
    expect(res.status).toBe(400);
    expect(UserImplementation.prototype.fetchUserSignUpForHMS).toHaveBeenCalled();
  });
  test("POST /user/signup/hms ->service file error return 500", async () => {
    jest.spyOn(validateHMS as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForHMS")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).post("/user/signup/hms").send({ /* valid payload */ });
    expect(res.status).toBe(500);
    expect(UserImplementation.prototype.fetchUserSignUpForHMS).toHaveBeenCalled();
  });


  /*//////////////////////////////////////////////////////////////
                        POST /user/signup/cbt
    //////////////////////////////////////////////////////////////*/

  test("POST /user/signup/cbt -> Account has been created successfully return 200", async () => {
    jest.spyOn(validateCBT as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForCBT")
      .mockResolvedValueOnce({ message: true } as any);

    const res = await request(app).post("/user/signup/cbt").send({ /* valid payload */ });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Account has been created successfully");
  });

  test("POST /user/signup/cbt -> Account was not created successfully return 400", async () => {
    jest.spyOn(validateCBT as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForCBT")
      .mockResolvedValueOnce({ message: false } as any);

    const res = await request(app).post("/user/signup/cbt").send({ /* valid payload */ });
    expect(res.status).toBe(400);
    expect(UserImplementation.prototype.fetchUserSignUpForCBT).toHaveBeenCalled();
  });
  test("POST /user/signup/cbt ->service file error return 500", async () => {
    jest.spyOn(validateCBT as any, "safeParseAsync").mockResolvedValueOnce({
      success: true,
      data: { /* valid payload */ },
    } as any);

    jest
      .spyOn(UserImplementation.prototype, "fetchUserSignUpForCBT")
      .mockRejectedValueOnce(new Error("DB connection failed") as any);

    const res = await request(app).post("/user/signup/cbt").send({ /* valid payload */ });
    expect(res.status).toBe(500);
    expect(UserImplementation.prototype.fetchUserSignUpForCBT).toHaveBeenCalled();
  });



});