
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth";

const authService = AuthService();

export function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("token" +token)
    if (!token) throw new Error();
    const { id, firstName, lastName } = authService.verify(token) as {
      id: number;
      firstName: string;
      lastName: string;
    };
    res.locals.user = { id, firstName, lastName };
    // console.log(res.locals.user)

    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Unauthorized");
  }
}
