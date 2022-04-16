import express, { Router, Request, Response } from "express";
import { ProductStore, Product } from "../models/product";
import { verifyAuthToken } from "../middleware/authentication_middleware";

export const productRouter = Router();
const store = new ProductStore();

productRouter.get("/", async (req, res) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(400).send("Faild to list products");
  }
});
productRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    if (!productId) throw new Error("missing product id ");
    const product = await store.show(productId);
    if (!product) throw new Error("invalid product id");
    res.json(product);
  } catch (err) {
    res.status(400).send("Faild to get product" + err);
  }
});

productRouter.post(
  "/",
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      // console.log("req.body : " + req.body);

      // console.log("req.body.product_name : " + req.body.product_name);

      const product: Omit<Product, "id"> = {
        product_name: req.body.product_name,
        price: req.body.price,
      };

      // console.log(product);

      const newProduct = await store.create(product);
      res.json(newProduct);
    } catch (err) {
      res.status(400);
      res.json(err);
    }
  }
);

productRouter.delete(
  "/:id",
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      // console.log(req.params.id);
      const productId = req.params.id;
      if (!productId) throw new Error();
      const product = await store.show(productId);
      if (!product) throw new Error("invalid product id");
      const deletedProduct = await store.delete(productId);
      if (deletedProduct) throw Error("Error in deleted product");
      res.json("successfully deleted product");
    } catch (err) {
      res.status(400).send("Faild to delete product" + err);
    }
  }
);
