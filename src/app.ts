import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import cors from "cors";
import { providerRouter } from "./modules/provider/provider.router";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { mealRouter } from "./modules/meal/meal.router";



const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/providers", providerRouter);

app.use("/api/meals", mealRouter);

app.get("/", (req, res) => {
  res.send("FoodMart server is running....");
});

app.use(notFound);

app.use(errorHandler);

export default app;