import myApp from "../../index";
import supertest from "supertest";
import { FullOrder } from "../../models/order";

const request = supertest(myApp);
const { TOKEN_SECRET: tokenSecret } = process.env;
let userId: number,
  token: string,
  productId: number,
  orderId: number,
  orderData: Omit<FullOrder, "id">;
describe("Test  orders endpoints responses", () => {
  const userInfo = {
    firstName: "user5",
    lastName: "Test5",
    password: "passwordtest5",
  };
  const productInfo = {
    product_name: "productTest2",
    price: "500",
  };

  beforeAll(async () => {
    if (!tokenSecret) throw new Error("missing  tokenSecret");
    const { body: userBody } = await request
      .post("/auth/register")
      .send(userInfo);
    userId = userBody.id;
    // console.log("usrId"+userId)
    token = userBody.token;

    const { body: productBody } = await request
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(productInfo);
    productId = productBody.id;
    //   console.log("productId"+productId)

    orderData = {
      user_id: userId,
      order_status: true,
      products: [
        {
          product_id: productId,
          quantity: 2,
        },
      ],
    };
  });

  afterAll(async () => {
    await request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    await request
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);
  });

  it("test  the create order use /orders endpoint", async () => {
    //   console.log(userId);
    //   console.log(JSON.stringify(orderData))

    const response = await request
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send(orderData);

    const { body, status } = response;
    // console.log("body" +JSON.stringify(body))
    orderId = body.id;

    expect(status).toBe(200);
    expect(body.user_id).toEqual(userId);
    expect(body.products).toEqual([
      {
        product_id: productId,
        quantity: 2,
      },
    ]);
  });

  it("gets the orders use  /orders endpoint successfully", async () => {
    const { body, status } = await request
      .get("/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(status).toBe(200);
  });

  it("gets the user use   /orders/:id endpoint", async () => {
    const { body, status } = await request
      .get(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toEqual({
      id: orderId,
      user_id: userId,
      order_status: true,
      products: [
        {
          product_id: productId,
          quantity: 2,
        },
      ],
    });
  });
  it("test get userOrders  user /orderd/user_orders/:id endpoint successfully", async () => {
    const { body, status } = await request
      .get(`/orders/user_orders/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(status).toBe(200);
    expect(body[0]).toEqual({
      id: orderId,
      user_id: userId,
      order_status: true,
      products: [
        {
          product_id: productId,
          quantity: 2,
        },
      ],
    });
  });

  it("delete product use /orders/:id the delete  endpoint successfully", async () => {
    const response = await request
      .delete(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
