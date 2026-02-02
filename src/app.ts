import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { providerRouter } from "./modules/provider/provider.router";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { mealRouter } from "./modules/meal/meal.router";
import { categoryRouter } from "./modules/category/category.router";
import { userRouter } from "./modules/user/user.router";
import { orderRouter } from "./modules/order/order.router";
import { reviewRouter } from "./modules/review/review.router";
import { cartRouter } from "./modules/cart/cart.router";



const app: Application = express();



// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL, // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean); // Remove undefined values



app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/users", userRouter);

app.use("/api/providers", providerRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/meals", mealRouter);

app.use("/api/carts", cartRouter);

app.use("/api/orders", orderRouter);

app.use("/api/reviews", reviewRouter);

app.get("/", (req, res) => {
  res.send("FoodMart server is running....");
});

app.use(notFound);

app.use(errorHandler);

export default app;