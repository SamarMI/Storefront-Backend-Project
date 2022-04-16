import myApp from "../../index";
import supertest from "supertest";


const request = supertest(myApp);
const { TOKEN_SECRET: tokenSecret } = process.env;

describe("Test  auth endpoints responses", () => {
  const userData = {
    firstName: "user",
    lastName: "Test1",
    password: "passwordtest1",
  };
  let user_id: number, token: string;
  if (!tokenSecret) throw new Error("missing  tokenSecret");

  it("CreateAccount use  auth/register endpoint successfully", async () => {
    const res = await request.post("/auth/register").send(userData);
    const { body, status } = res;
    expect(status).toEqual(200);
    user_id = body.id;

    // console.log("body" +JSON.stringify(body))

    expect(body).not.toBeNull();
    expect(body.id).not.toBeNull();
    expect(body.token).not.toBeNull();
  });
  it("Authenticate user use  auth/login endpoint successfully", async () => {
    const { body } = await request.post("/auth/login").send(userData);
    token = body.token;

    expect(body).not.toBeNull();
    expect(body.firstName).toEqual(userData.firstName);
    expect(body.lastName).toEqual(userData.lastName);
  });
  it("delete createdUser use users/:id endpoint sccessfully", async () => {
    const response = await request
      .delete(`/users/${user_id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });


});
