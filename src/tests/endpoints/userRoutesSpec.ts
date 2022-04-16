import myApp from "../../index";
import supertest from "supertest";

const request = supertest(myApp);
const { TOKEN_SECRET: tokenSecret } = process.env;
let userId: number, token: string;

describe("Test  users endpoints responses", () => {
  const userInfo = {
    firstName: "user3",
    lastName: "Test3",
    password: "passwordtest3",
  };

  beforeAll(async () => {
    if (!tokenSecret) throw new Error("missing  tokenSecret");
    const { body } = await request.post("/auth/register").send(userInfo);
    token = body.token;
    //  console.log("body.token" +body.token)
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
  });

  it("test  the create user use /user endpoint", async () => {
    const userData = {
      firstName: "user4",
      lastName: "Test4",
      password: "passwordtest4",
    };
    const response = await request
      .post("/users")
      .send(userData)
      .set("Authorization", `Bearer ${token}`);

    const { body, status } = response;
    // console.log("body" +JSON.stringify(body))

    userId = body.id;
    expect(status).toBe(200);
    expect(body.firstname).toEqual(userData.firstName);
    expect(body.lastname).toEqual(userData.lastName);
  });

  it("gets the /users endpoint successfully", async () => {
    const response = await request.get("/users");
    expect(response.status).toBe(200);
  });

  it("gets the user use   /users/:id endpoint", async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("gets the delete endpoint", async () => {
    const response = await request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
