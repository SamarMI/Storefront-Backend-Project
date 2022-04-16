import { FullOrder, OrderStore } from "../../models/order";
import { UserStore } from "../../models/user";
import { Product, ProductStore } from "../../models/product";

const MyOrderStore = new OrderStore();
const MyProductStore = new ProductStore();
const MyUserStore = new UserStore();
let orderInfo: Omit<FullOrder, "id">, product_id: number, user_id: number ,order_id:number;

describe("Order Model", () => {
  beforeAll(async () => {
    const userInfo = {
      firstName: "samar",
      lastName: "mohamed",
      password: "mypassword",
    };

    const product: Product = await MyProductStore.create({
      product_name: "OrderSpec Product",
      price: "99",
      category: "category1",
    });

    const user = await MyUserStore.create(
      userInfo.firstName,
      userInfo.lastName,
      userInfo.password
    );

    user_id = user.id;
    // console.log("userId :" +user_id)
    product_id = product.id;

    orderInfo = {
      user_id: user_id,
      order_status: true,
      products: [
        {
          product_id: product_id,
          quantity: 5,
        },
      ],
    };
  });

  afterAll(async () => {

    await MyProductStore.delete(`${product_id}`);
    await MyUserStore.delete(`${user_id}`);
  });

  it("should have an index method", () => {
    expect(MyOrderStore.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(MyOrderStore.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(MyOrderStore.create).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(MyOrderStore.delete).toBeDefined();
  });
  it("should have a getUserOrders method", () => {
    expect(MyOrderStore.getUserOrders).toBeDefined();
  });

  it("create method should add a order", async () => {
    const result = await MyOrderStore.create(orderInfo);
    order_id=result.id;
    expect(result).not.toBeNull;
    expect(result.user_id).toEqual(user_id);
    expect(result.order_status).toEqual(orderInfo.order_status);
  });

  it("index method should return a list of orders", async () => {
    const result = await MyOrderStore.index();
    expect(result).toEqual([
      {
        id: order_id,
        user_id: user_id,
        order_status: true,
        products: orderInfo.products,
      },
    ]);
  });

  it("show method should return the correct order", async () => {
    const result = await MyOrderStore.show("2");
    expect(result).not.toBeNull;
    expect(result).toEqual({
      id: order_id,
      user_id: 6,
      order_status: true,
      products: orderInfo.products,
    });
  });

  it("delete method should remove the order", async () => {
    MyOrderStore.delete(`${order_id}`);
    const result = await MyOrderStore.index();

    expect(result).toBeNull;
  });
});
