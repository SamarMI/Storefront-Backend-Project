import { Product, ProductStore } from "../../models/product";

const store = new ProductStore();

describe("Product Model", () => {

  const productInfo:Omit<Product,"id">={
    product_name: "new_product1",
      price: "250",
      category: "category1 ",

  }
  let product_id:number;

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add a Product", async () => {
    const result = await store.create(productInfo);
    expect(result.product_name).toEqual(productInfo.product_name);
    expect(result.category).toEqual(productInfo.category);
    expect(result.price).toEqual(productInfo.price);
    product_id=result.id;

  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    const productIndex = result.length - 1;
    expect(result[productIndex]).toEqual({
      id: product_id,
      product_name: productInfo.product_name,
      price: productInfo.price,
      category: productInfo.category,
    });
  });

  it("show method should return the correct product", async () => {
    const result = await store.show("4");
    expect(result).toEqual({
      id: product_id,
      product_name: productInfo.product_name,
      price: productInfo.price,
      category: productInfo.category,
    });
  });

  it("delete method should remove the product", async () => {
    store.delete(`${product_id}`);
    const result = await store.index();

    expect(result).toBeNull;
  });
});
