import express, {  Request, Response } from "express";


import { authRouter, userRouter, productRouter, orderRouter } from "./routes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World 🌍",
  });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
