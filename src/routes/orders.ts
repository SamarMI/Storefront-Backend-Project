import express, { Router, Request, Response } from "express";

import { OrderStore, OrderProduct, Order, FullOrder } from "../models/order";
import { verifyAuthToken } from "../middleware/authentication_middleware";

export const orderRouter = Router();
const store = new OrderStore();

orderRouter.get("/", verifyAuthToken, async (req:Request, res:Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).send("Faild to list orders");
  }
});

orderRouter.get("/:id", verifyAuthToken, async (req:Request, res:Response) => {
  try {
    const orderId = req.params.id;
    const order = await store.show(orderId);
    if (!order) throw new Error(`Invalid order  with id = ${orderId}`);

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Faild to list order with id ${req.params.id}`);
  }
});

orderRouter.post("/", verifyAuthToken, async (req:Request, res:Response) => {
  try {
    const user_id = req.body.user_id as unknown as number;
    const order_status = req.body.order_status as unknown as boolean;
    const products = req.body.products as unknown as OrderProduct[];
    // console.log(products)
    if (!user_id) throw new Error("missing user_id");
    if (!products) throw new Error("missing  products");
    if (!order_status) throw new Error("missing order_status");

    const orderStored: Order = await store.create({
      user_id,
      order_status,
      products,
    });
    res.json(orderStored);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Faild to store order as${err}`);
  }
});

orderRouter.delete("/:id", verifyAuthToken, async (req:Request, res:Response) => {
  try {
    const orderId = req.params.id;
    const order = await store.show(orderId);
    if (!order) throw new Error(`Invalid order  with id = ${orderId}`);
    const deletedOrder = await store.delete(orderId);
    if (!deletedOrder) {
      res.json("successfuly deleted order");
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(`Faild to delete order with id ${req.params.id}` + err);
  }
});

orderRouter.get("/user_orders/:id", verifyAuthToken, async (req:Request, res:Response) => {
  try {
    const userId = req.params.id;
    const order = await store.getUserOrders(userId);
    if (!order) throw new Error(`Invalid order  for user_id = ${userId}`);

    res.json(order);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(`Faild to list orders with for user_id ${req.params.id}`);
  }
});
