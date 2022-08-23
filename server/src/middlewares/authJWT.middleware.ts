import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ProductController from "../controllers/product.controller";
import { Product } from "../models/product";

export interface ICustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token)
    if (!token) {
      throw new Error("Authentication required");
    }

    const decoded = jwt.verify(token, process.env.API_KEY || "");
    (req as ICustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send((err as Error).message);
  }
};

export const authSellerPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authSeller(req, res, next, true);
};

export const authSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
  isPost?: boolean
) => {
  try {
    const tokenDecoded = (req as ICustomRequest).token;
    if (!tokenDecoded) {
      // First auth failed
      throw new Error("Auth failed");
    }

    let sellerId;
    if (isPost) {
      sellerId = req.body.sellerId;
    } else {
      const productId = req.params.id;

      if (!productId) {
        throw new Error("productId missing");
      }

      const controller = new ProductController();
      const response = await controller.getProduct(productId);
      if (!response) {
        throw new Error("Product not found");
      }
      
      sellerId = (response as Product).seller;
    }

    if (sellerId) {
      if (sellerId !== Number((tokenDecoded as JwtPayload).id)) {
        throw new Error("User not authorised to perform this action");
      }
    }

    next();
  } catch (err) {
    return res.status(405).send((err as Error).message);
  }
};
