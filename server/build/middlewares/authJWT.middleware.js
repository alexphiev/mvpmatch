"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSeller = exports.authSellerPost = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        console.log(token);
        if (!token) {
            throw new Error("Authentication required");
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.API_KEY || "");
        req.token = decoded;
        next();
    }
    catch (err) {
        res.status(401).send(err.message);
    }
});
exports.auth = auth;
const authSellerPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.authSeller)(req, res, next, true);
});
exports.authSellerPost = authSellerPost;
const authSeller = (req, res, next, isPost) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenDecoded = req.token;
        if (!tokenDecoded) {
            // First auth failed
            throw new Error("Auth failed");
        }
        let sellerId;
        if (isPost) {
            sellerId = req.body.sellerId;
        }
        else {
            const productId = req.params.id;
            if (!productId) {
                throw new Error("productId missing");
            }
            const controller = new product_controller_1.default();
            const response = yield controller.getProduct(productId);
            if (!response) {
                throw new Error("Product not found");
            }
            sellerId = response.seller;
        }
        if (sellerId) {
            if (sellerId !== Number(tokenDecoded.id)) {
                throw new Error("User not authorised to perform this action");
            }
        }
        next();
    }
    catch (err) {
        return res.status(405).send(err.message);
    }
});
exports.authSeller = authSeller;
