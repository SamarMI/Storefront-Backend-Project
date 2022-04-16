import client from "../database";

export type OrderProduct = {
  product_id: number;
  quantity: number;
};
export type Order = {
  id: number;
  user_id: number;
  order_status: boolean;
};

export type FullOrder = {
  id: number;
  user_id: number;
  order_status: boolean;
  products: OrderProduct[];
};

export class OrderStore {
  async index(): Promise<FullOrder[]> {
    try {
      const conn = await client.connect();

      const orders_sql = "SELECT *  FROM orders  ";
      const { rows } = await conn.query(orders_sql);
      const orderProducts_sql =
        "SELECT product_id , quantity from order_products where order_id=($1) ";
      const orders = [];
      for (const order of rows) {
        const { rows: orderProductRows } = await conn.query(orderProducts_sql, [
          order.id,
        ]);
        orders.push({
          ...order,
          products: orderProductRows,
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<FullOrder> {
    try {
      const orders_sql = "SELECT *  FROM orders  where id=($1) ";
      const conn = await client.connect();

      const { rows } = await conn.query(orders_sql, [id]);
      const orderProducts_sql =
        "SELECT product_id , quantity from order_products where order_id=($1) ";
      const order = rows[0];
      if (!order) throw new Error("Invalid order id");

      const { rows: orderProductRows } = await conn.query(orderProducts_sql, [
        order.id,
      ]);
      const fullOrder = {
        ...order,
        products: orderProductRows,
      };

      conn.release();

      return fullOrder;
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(FullOrder: Omit<FullOrder, "id">): Promise<Order> {
    try {
      const order_sql =
        "INSERT INTO orders (user_id, order_status) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();

      const { rows } = await conn.query(order_sql, [
        FullOrder.user_id,
        FullOrder.order_status,
      ]);

      const orderStored = rows[0];

      const product_sql =
        "INSERT INTO order_products (order_id, product_id,quantity) VALUES($1, $2 , $3) RETURNING product_id, quantity";

      const orderProducts = [];
      for (const product of FullOrder.products) {
        const { product_id, quantity } = product;
        const { rows: orderProductRows } = await conn.query(product_sql, [
          orderStored.id,
          product_id,
          quantity,
        ]);
        orderProducts.push(orderProductRows[0]);
      }
      const FullOrderStored = {
        ...orderStored,
        products: orderProducts,
      };

      conn.release();

      return FullOrderStored;
    } catch (err) {
      throw new Error(
        `Could not add new order for user ${FullOrder.user_id}. ${err}`
      );
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const orderProducts_sql =
        "DELETE FROM order_products WHERE order_id=($1)  ";
      const conn = await client.connect();

      const result = await conn.query(orderProducts_sql, [id]);
      const order_products = result.rows[0];

      const order_sql = "DELETE FROM orders WHERE id=($1)  ";
      const { rows } = await conn.query(order_sql, [id]);
      const order = rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }

  async getUserOrders(user_id: string): Promise<FullOrder[]> {
    try {
      const orders_sql = "SELECT *  FROM orders  where user_id=($1) ";
      const conn = await client.connect();

      const { rows } = await conn.query(orders_sql, [user_id]);
      const orderProducts_sql =
        "SELECT product_id , quantity from order_products where order_id=($1) ";

      // const {rows: orderProductRows} = await conn.query(orderProducts_sql, [order.id])
      const orders = [];
      for (const order of rows) {
        const { rows: orderProductRows } = await conn.query(orderProducts_sql, [
          order.id,
        ]);
        orders.push({
          ...order,
          products: orderProductRows,
        });
      }

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(
        `Could not list  order for user_id ${user_id}. Error: ${err}`
      );
    }
  }
}
