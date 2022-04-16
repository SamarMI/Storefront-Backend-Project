import bcrypt from "bcrypt";
import { UserStore } from "../models/user";
import jwt from "jsonwebtoken";

const {
  TOKEN_SECRET: tokenSecret,
  BCRYPT_PASSWORD: pepper,
  SALT_ROUNDS: saltRounds,
} = process.env;
const store = new UserStore();

async function login(
  firstName: string,
  lastName: string,
  password: string
): Promise<{ firstName: string; lastName: string; token: string }> {
  try {
    if (!tokenSecret || !pepper) throw new Error("missing env variables");

    const storedUser = await store.getUser(firstName, lastName);
    const storedHashPassword = storedUser.password_digest;
    const isValid = await bcrypt.compare(password + pepper, storedHashPassword);
    if (!isValid) throw new Error(" Invalid login");

    const token = jwt.sign(
      {
        id: storedUser.id,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
      },
      tokenSecret
    );
    //  console.log("storedUser"+storedUser.firstName)
    //  console.log("storedUser"+storedUser.password_digest)

    const outInfo = {
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      token: token,
    };
    // console.log("outInfo"+ JSON. stringify(outInfo))

    return {
      firstName: storedUser.firstName,
      lastName: storedUser.lastName,
      token: token,
    };
  } catch (err) {
    throw new Error(`Could not find user . Error: ${err}`);
  }
}

async function createAccount(
  firstName: string,
  lastName: string,
  password: string
): Promise<{ id: number; firstName: string; lastName: string; token: string }> {
  if (!tokenSecret || !pepper || !saltRounds)
    throw new Error("missing env variables");
  const userCreated = await store.create(firstName, lastName, password);
  const token = jwt.sign(
    {
      id: userCreated.id,
      firstName: userCreated.firstName,
      lastName: userCreated.lastName,
    },
    tokenSecret
  );
  return {
    id: userCreated.id,
    firstName: userCreated.firstName,
    lastName: userCreated.lastName,
    token,
  };
}

function verify(token: string) {
  if (!tokenSecret) throw new Error("Missing env variables");
  const userInfo = jwt.verify(token, tokenSecret);
  // console.log("userInfo"+userInfo)
  return userInfo;
}

export function AuthService() {
  return {
    login,
    createAccount,
    verify,
  };
}
