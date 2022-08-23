"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authJWT_middleware_1 = require("../middlewares/authJWT.middleware");
const transaction_repository_1 = require("../repositories/transaction.repository");
const auth_router_1 = __importDefault(require("./auth.router"));
const product_router_1 = __importDefault(require("./product.router"));
const user_router_1 = __importDefault(require("./user.router"));
const router = express_1.default.Router();
router.use("/users", user_router_1.default);
router.use("/products", product_router_1.default);
router.use("/auth", auth_router_1.default);
// Endpoints related to transactions
router.post("/deposit", authJWT_middleware_1.auth, transaction_repository_1.deposit);
router.post("/buy", authJWT_middleware_1.auth, transaction_repository_1.buy);
router.post("/reset", authJWT_middleware_1.auth, transaction_repository_1.reset);
exports.default = router;
