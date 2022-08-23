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
const express_1 = __importDefault(require("express"));
const authJWT_middleware_1 = require("../middlewares/authJWT.middleware");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const router = express_1.default.Router();
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new product_controller_1.default();
    const response = yield controller.getProducts();
    return res.send(response);
}));
router.post("/", authJWT_middleware_1.auth, authJWT_middleware_1.authSellerPost, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new product_controller_1.default();
    const response = yield controller.createProduct(req.body);
    try {
        return res.send(response);
    }
    catch (_a) {
        return res.send(response);
    }
}));
router.get("/:id", authJWT_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new product_controller_1.default();
    const response = yield controller.getProduct(req.params.id);
    if (!response)
        res.status(404).send({ message: "No product found" });
    return res.send(response);
}));
router.patch("/:id", authJWT_middleware_1.auth, authJWT_middleware_1.authSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new product_controller_1.default();
    const { body } = req;
    const response = yield controller.updateProduct(req.params.id, body);
    if (!response)
        return res.status(404).send({ message: "No product found" });
    try {
        return res.send(response);
    }
    catch (_b) { }
}));
router.delete("/:id", authJWT_middleware_1.auth, authJWT_middleware_1.authSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new product_controller_1.default();
    const response = yield controller.deleteProduct(req.params.id);
    if (!response)
        res.status(404).send({ message: "No product found" });
    try {
        return res.send(response);
    }
    catch (_c) { }
}));
exports.default = router;
