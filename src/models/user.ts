import client from "../database";
import bcrypt from "bcrypt";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password_digest: string;
};

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async getUser(
    firstName: string,
    lastName: string
  ): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    password_digest: string;
  }> {
    try {
      const sql = "SELECT * FROM users WHERE firstName=($1) AND lastName=($2) ";
      const conn = await client.connect();

      const result = await conn.query(sql, [firstName, lastName]);
      console.log(" firstName:" + firstName);

      conn.release();

      if (result.rowCount === 0) {
        throw new Error("Cant find user");
      }

      console.log("user id:" + result.rows[0].id);
      console.log("user firstName:" + result.rows[0].firstname);

      const userInfo = {
        id: result.rows[0].id,
        firstName: result.rows[0].firstname,
        lastName: result.rows[0].lastname,
        password_digest: result.rows[0].password_digest,
      };

      return userInfo;
    } catch (err) {
      throw new Error(
        `Could not find user : ${firstName} ${lastName}. Error: ${err}`
      );
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User> {
    try {
      if (!saltRounds || !pepper) throw new Error("missing env variables");
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (firstName,lastName, password_digest) VALUES($1, $2,$3) RETURNING id ,firstName,lastName ";

      const hash = bcrypt.hashSync(password + pepper, Number(saltRounds));

      const result = await conn.query(sql, [firstName, lastName, hash]);
      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `unable create user (${firstName} , ${lastName}): ${err}`
      );
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)";
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
