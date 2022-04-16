import myApp from "../../index";
import supertest from "supertest";
import { Product } from "../../models/product";

const request = supertest(myApp);
const { TOKEN_SECRET: tokenSecret } = process.env;

describe("Test  products endpoints responses", () => {
  const productInfo :Omit<Product,"id">= {
    product_name: "productTest1",
    price: "999",
    category: "categore1",
  };
  const userInfo = {
    firstName: "user2",
    lastName: "Test2",
    password: "passwordtest2",
  };
  let userId: number, productId: number, token: string;
  beforeAll(async () => {
    if (!tokenSecret) throw new Error("missing  tokenSecret");
    const { body } = await request.post("/auth/register").send(userInfo);
    userId = body.id;
    // console.log("userId" + userId)

    token = body.token;
    userId = body.id;
    //  console.log("body.token" +body.token)
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
  });

  it("create product use /poroduct endpoint successfully ", async () => {
    const response = await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(productInfo);
    const { body, status } = response;

    productId = body.id;
    expect(status).toBe(200);
  });

  it("gets the  all products  use  /products endpoint successfully", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });

  it("show  product use /products/:id endpoint successfully", async () => {
    const response = await request.get(`/products/${productId}`);
    const { body, status } = response;
    expect(status).toBe(200);
    expect(body.product_name).toEqual(productInfo.product_name);
    expect(body.price).toEqual(productInfo.price);
  });

  it("show  product  faild as send not exist id use /products/:id endpoint", async () => {
    const response = await request.get(`/products/100`);
    const { body, status } = response;
    expect(status).not.toBe(200);
  });

  it("gets the delete endpoint", async () => {
    const response = await request
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
    const { body, status } = response;

    expect(status).toBe(200);
  });
});
