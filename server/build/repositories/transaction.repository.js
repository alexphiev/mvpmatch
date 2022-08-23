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
exports.reset = exports.buy = exports.deposit = void 0;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_1 = require("../models/user");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const ALLOWED_AMOUNTS = [5, 10, 20, 50, 100];
/**
 * Users with a “buyer” role can deposit only 5, 10, 20, 50 and 100 cent coins into their vending machine account
 */
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.token.id;
    if (!userId || userId === "") {
        // Throw error as this should not happen
        throw new Error("Authentication token missing but authentifcation process succeeded");
    }
    const controller = new user_controller_1.default();
    const user = yield controller.getUser(userId);
    if (!user) {
        return res.status(404).send({ message: "No user found" });
    }
    const role = user.role;
    if (role !== user_1.Role.BUYER) {
        return res.status(405).send({ message: "User is not a buyer" });
    }
    const { amount } = req.body;
    if (ALLOWED_AMOUNTS.indexOf(amount) === -1) {
        return res.status(405).send({
            message: "The machine only accepts 10, 20, 50 and 100 cents coins",
        });
    }
    const { deposit } = user;
    const newDeposit = Number(deposit) + Number(amount);
    const resonse = yield controller.updateUser(userId, {
        deposit: newDeposit,
    });
    if (!express_1.response) {
        return res.status(500).send({ message: "Could not update the user" });
    }
    return res.status(200).send({
        message: "Successful deposit",
        deposit: resonse.deposit,
    });
});
exports.deposit = deposit;
/**
 * Users with a “buyer” role can buy products with the money they’ve deposited.
 * This method will not return an error message if one of the products is missing or
 * the deposit is not sufficient. It will simply not purchase the product(s).
 */
const buy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.token.id;
    if (!userId || userId === "") {
        // Throw error as this should not happen
        throw new Error("Authentication token missing but authentifcation process succeeded");
    }
    const userController = new user_controller_1.default();
    const user = yield userController.getUser(userId);
    if (!user) {
        return res.status(404).send({ message: "No user found" });
    }
    const role = user.role;
    if (role !== user_1.Role.BUYER) {
        return res.status(405).send({ message: "User is not a buyer" });
    }
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(405).send({
            message: "Missing product(s)",
        });
    }
    let deposit = user.deposit;
    const productController = new product_controller_1.default();
    let amountSpent = 0;
    let purchase = [];
    for (let i = 0; i < products.length; i++) {
        const productId = products[i];
        const product = yield productController.getProduct(productId);
        if (product) {
            const { amountAvailable, cost } = product;
            if (amountAvailable > 0) {
                if (deposit >= cost) {
                    amountSpent = Number(amountSpent) + Number(cost);
                    deposit = deposit - cost * 100;
                    purchase.push(product.productName);
                    yield productController.updateProduct(productId, {
                        amountAvailable: amountAvailable - 1,
                    });
                }
            }
        }
    }
    const response = yield userController.updateUser(userId, { deposit });
    if (!response) {
        return res.status(500).send({
            message: "An error occured while updating the user",
        });
    }
    const change = getDepositAsCoins(deposit);
    const buyResponse = {
        change,
        purchase,
        amountSpent,
    };
    return res.status(200).send(buyResponse);
});
exports.buy = buy;
/**
 * Users with a “buyer” role can reset their deposit back to 0
 */
const reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.token.id;
    if (!userId || userId === "") {
        // Throw error as this should not happen
        throw new Error("Authentication token missing but authentifcation process succeeded");
    }
    const userController = new user_controller_1.default();
    const user = yield userController.getUser(userId);
    if (!user) {
        return res.status(404).send({ message: "No user found" });
    }
    const role = user.role;
    if (role !== user_1.Role.BUYER) {
        return res.status(405).send({ message: "User is not a buyer" });
    }
    const result = yield userController.updateUser(userId, { deposit: 0 });
    if (result) {
        const user = result;
        res.status(200).send({ deposit: user.deposit });
    }
    else {
        res
            .status(500)
            .send({ message: "An error occured while updating the user deposit" });
    }
});
exports.reset = reset;
/**
 * Returns an array of coins with priority for hogh coins
 */
const getDepositAsCoins = (deposit) => {
    let remaining = deposit;
    const change = [];
    ALLOWED_AMOUNTS.sort((a, b) => b - a).map((amount) => {
        const quotient = Math.floor(remaining / amount);
        const rem = remaining % amount;
        for (let i = 0; i < quotient; i++) {
            change.push(amount);
            remaining = rem;
        }
    });
    return change;
};
