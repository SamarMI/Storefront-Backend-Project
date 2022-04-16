import express, { Router, Request, Response } from "express";

import { AuthService } from "../services/auth";

const authService = AuthService();
export const authRouter = Router();

authRouter.post("/register", async (req:Request, res:Response) => {
  try {
    const params = req.body as {
      firstName: string;
      lastName: string;
      password: string;
    };
    const userInfo = await authService.createAccount(
      params.firstName,
      params.lastName,
      params.password
    );

    res.json(userInfo);
  } catch (err) {
    // console.error(err);
    res.status(404).send("Failed to create an account");
  }
});

authRouter.post("/login", async (req:Request, res:Response) => {
  try {
    const params = req.body as {
      firstName: string;
      lastName: string;
      password: string;
    };

    const userInfo = await authService.login(
      params.firstName,
      params.lastName,
      params.password
    );

    res.json(userInfo);
  } catch (err) {
    // console.error(err);
    res.status(404).send("Failed to login" + err);
  }
});
