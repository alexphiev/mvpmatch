import express from "express";
import { auth } from "../middlewares/authJWT.middleware";
import { buy, deposit, reset } from "../repositories/transaction.repository";
import AuthRouter from "./auth.router";
import ProductRouter from "./product.router";
import UserRouter from "./user.router";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/products", ProductRouter);
router.use("/auth", AuthRouter);

// Endpoints related to transactions
router.post("/deposit", auth, deposit);
router.post("/buy", auth, buy);
router.post("/reset", auth, reset);

export default router;
