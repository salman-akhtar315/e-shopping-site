import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(cors({
   origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
   credentials: true
}))

app.use(express.json({     
    limit: "16kb"             
}))

app.use(express.urlencoded({     
    limit: "16kb",
    extended: true
}))

app.use(express.static("public"))

app.use(cookieParser())

// Routes
import userRouter from "./routes/user_routes.js";
import categoryRouter from "./routes/category_routes.js";
import productRouter from "./routes/product_routes.js";
import orderRouter from "./routes/order_routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

export default app;