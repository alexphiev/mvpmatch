import { ICustomRequest } from "../middlewares/authJWT.middleware";
import { Request, response, Response } from "express";
import UserController from "../controllers/user.controller";
import { Role, User } from "../models/user";
import { JwtPayload } from "jsonwebtoken";
import ProductController from "../controllers/product.controller";

const ALLOWED_AMOUNTS = [5, 10, 20, 50, 100];

interface BuyResponse {
  amountSpent: number;
  purchase: string[]; // contains product names
  change: number[]; // Array of allowed coins
}

/**
 * Users with a “buyer” role can deposit only 5, 10, 20, 50 and 100 cent coins into their vending machine account
 */
export const deposit = async (req: Request, res: Response) => {
  const userId = ((req as ICustomRequest).token as JwtPayload).id;

  if (!userId || userId === "") {
    // Throw error as this should not happen
    throw new Error(
      "Authentication token missing but authentifcation process succeeded"
    );
  }

  const controller = new UserController();
  const user = await controller.getUser(userId as string);

  if (!user) {
    return res.status(404).send({ message: "No user found" });
  }

  const role = user.role;
  if (role !== Role.BUYER) {
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

  const resonse = await controller.updateUser(userId as string, {
    deposit: newDeposit,
  });
  if (!response) {
    return res.status(500).send({ message: "Could not update the user" });
  }
  return res.status(200).send({
    message: "Successful deposit",
    deposit: (resonse as User).deposit,
  });
};

/**
 * Users with a “buyer” role can buy products with the money they’ve deposited.
 * This method will not return an error message if one of the products is missing or
 * the deposit is not sufficient. It will simply not purchase the product(s).
 */
export const buy = async (req: Request, res: Response) => {
  const userId = ((req as ICustomRequest).token as JwtPayload).id;

  if (!userId || userId === "") {
    // Throw error as this should not happen
    throw new Error(
      "Authentication token missing but authentifcation process succeeded"
    );
  }

  const userController = new UserController();
  const user = await userController.getUser(userId as string);

  if (!user) {
    return res.status(404).send({ message: "No user found" });
  }

  const role = user.role;
  if (role !== Role.BUYER) {
    return res.status(405).send({ message: "User is not a buyer" });
  }

  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(405).send({
      message: "Missing product(s)",
    });
  }

  let deposit = user.deposit;
  const productController = new ProductController();
  let amountSpent = 0;
  let purchase: string[] = [];

  for (let i = 0; i < products.length; i++) {
    const productId: string = products[i];
    const product = await productController.getProduct(productId);

    if (product) {
      const { amountAvailable, cost } = product;
      if (amountAvailable > 0) {
        if (deposit >= cost) {
          amountSpent = Number(amountSpent) + Number(cost);
          deposit = deposit - cost * 100;
          purchase.push(product.productName);

          await productController.updateProduct(productId, {
            amountAvailable: amountAvailable - 1,
          });
        }
      }
    }
  }

  const response = await userController.updateUser(userId, { deposit });

  if (!response) {
    return res.status(500).send({
      message: "An error occured while updating the user",
    });
  }

  const change: number[] = getDepositAsCoins(deposit);

  const buyResponse: BuyResponse = {
    change,
    purchase,
    amountSpent,
  };

  return res.status(200).send(buyResponse);
};

/**
 * Users with a “buyer” role can reset their deposit back to 0
 */
export const reset = async (req: Request, res: Response) => {
  const userId = ((req as ICustomRequest).token as JwtPayload).id;

  if (!userId || userId === "") {
    // Throw error as this should not happen
    throw new Error(
      "Authentication token missing but authentifcation process succeeded"
    );
  }

  const userController = new UserController();
  const user = await userController.getUser(userId as string);

  if (!user) {
    return res.status(404).send({ message: "No user found" });
  }

  const role = user.role;
  if (role !== Role.BUYER) {
    return res.status(405).send({ message: "User is not a buyer" });
  }

  const result = await userController.updateUser(userId, { deposit: 0 });

  if (result) {
    const user = result;
    res.status(200).send({ deposit: user.deposit });
  } else {
    res
      .status(500)
      .send({ message: "An error occured while updating the user deposit" });
  }
};

/**
 * Returns an array of coins with priority for hogh coins
 */
const getDepositAsCoins = (deposit: number) => {
  let remaining = deposit;
  const change: number[] = [];

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
