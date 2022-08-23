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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = exports.checkSellerId = exports.getProducts = void 0;
const user_1 = require("../models/user");
const database_1 = require("../config/database");
const product_1 = require("../models/product");
const user_repository_1 = require("./user.repository");
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const productRepository = database_1.dataSource.getRepository(product_1.Product);
    return productRepository.find();
});
exports.getProducts = getProducts;
const checkSellerId = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_repository_1.getUser)(sellerId);
    if (!user) {
        return false;
    }
    if (user.role === user_1.Role.SELLER) {
        return true;
    }
    return false;
});
exports.checkSellerId = checkSellerId;
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const productRepository = database_1.dataSource.getRepository(product_1.Product);
    const product = new product_1.Product();
    if (payload.sellerId) {
        // Checking if the sellerId is mapped to an existing seller user
        const isSeller = yield (0, exports.checkSellerId)(payload.sellerId);
        if (!isSeller) {
            return null;
        }
    }
    return productRepository.save(Object.assign(Object.assign({}, product), payload));
});
exports.createProduct = createProduct;
const getProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const productRepository = database_1.dataSource.getRepository(product_1.Product);
    const product = yield productRepository.findOne({ where: { id } });
    if (!product)
        return null;
    return product;
});
exports.getProduct = getProduct;
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const productRepository = database_1.dataSource.getRepository(product_1.Product);
    const product = yield productRepository.findOne({ where: { id } });
    if (!product) {
        return {
            message: "Product not found"
        };
    }
    if (payload.sellerId) {
        // Checking if the sellerId is mapped to an existing seller user
        const isSeller = yield (0, exports.checkSellerId)(payload.sellerId);
        if (!isSeller) {
            return {
                message: "sellerId doesn't match a valid seller user",
            };
        }
    }
    productRepository.merge(product, payload);
    return yield productRepository.save(product);
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const productRepository = database_1.dataSource.getRepository(product_1.Product);
    return yield productRepository.delete(id);
});
exports.deleteProduct = deleteProduct;
