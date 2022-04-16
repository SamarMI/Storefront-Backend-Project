

import express, { Router, Request, Response } from "express";
import { UserStore, User } from "../models/user";
import { verifyAuthToken } from "../middleware/authentication_middleware";

export const userRouter = Router();
const store = new UserStore();

userRouter.get("/", async (req, res) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).send("Faild to list users");
  }
});
userRouter.get("/:id", verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) throw new Error();
    const user = await store.show(userId);
    if (!user) throw new Error("Invalid userId");
    res.json(user);
  } catch (err) {
    res.status(400).send("Faild to get user");
  }
});

userRouter.post("/", verifyAuthToken, async (req: Request, res: Response) => {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  };

  try {
    const newUser = await store.create(
      req.body.firstName,
      req.body.lastName,
      req.body.password
    );

    res.json(newUser);
  } catch (err) {
    res.status(400);
    res.json(err + user);
  }
});
userRouter.delete(
  "/:id",
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      // console.log(req.params.id);
      const userId = req.params.id;
      if (!userId) throw new Error("missing userId");
      const user = await store.show(userId);
      if (!user) throw new Error("Invalid userId");

      const deletedUser = await store.delete(userId);
      if (!deletedUser) {
        res.json("successfuly delete user");
      }
    } catch (err) {
      res.status(400).send("Faild to delete user" + err);
    }
  }
);
