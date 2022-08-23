import { Role, User } from "../models/user";
import { dataSource } from "../config/database";
import { Product } from "../models/product";
import { getUser } from "./user.repository";

export interface IProductPayload {
  productName: string;
  cost: number;
  amountAvailable: number;
  sellerId: number;
}

export interface IProductPatchPayload {
  productName?: string;
  cost?: number;
  amountAvailable?: number;
  sellerId?: number;
}

export const getProducts = async (): Promise<Array<Product>> => {
  const productRepository = dataSource.getRepository(Product);
  return productRepository.find();
};

export const checkSellerId = async (sellerId: number): Promise<boolean> => {
  const user: User | null = await getUser(sellerId);
  if (!user) {
    return false;
  }
  if (user.role === Role.SELLER) {
    return true;
  }
  return false;
};

export const createProduct = async (payload: IProductPayload) => {
  const productRepository = dataSource.getRepository(Product);
  const product = new Product();

  if (payload.sellerId) {
    // Checking if the sellerId is mapped to an existing seller user
    const isSeller = await checkSellerId(payload.sellerId);
    if (!isSeller) {
      return null;
    }
  }

  return productRepository.save({
    ...product,
    ...payload,
  });
};

export const getProduct = async (id: number): Promise<Product | null> => {
  const productRepository = dataSource.getRepository(Product);
  const product = await productRepository.findOne({ where: { id } });
  if (!product) return null;
  return product;
};

export const updateProduct = async (
  id: number,
  payload: IProductPatchPayload
): Promise<Product | { message: string }> => {
  const productRepository = dataSource.getRepository(Product);
  const product = await productRepository.findOne({ where: { id } });
  if (!product) {
    return {
      message: "Product not found"
    };
  }

  if (payload.sellerId) {
    // Checking if the sellerId is mapped to an existing seller user
    const isSeller = await checkSellerId(payload.sellerId);
    if (!isSeller) {
      return {
        message: "sellerId doesn't match a valid seller user",
      };
    }
  }
  productRepository.merge(product, payload);
  return await productRepository.save(product);
};

export const deleteProduct = async (id: number) => {
  const productRepository = dataSource.getRepository(Product);
  return await productRepository.delete(id);
};
