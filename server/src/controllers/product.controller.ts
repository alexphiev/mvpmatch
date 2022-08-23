import {
  Get,
  Route,
  Tags,
  Post,
  Body,
  Path,
  Security,
  Patch,
  Delete,
} from "tsoa";
import { DeleteResult } from "typeorm";
import { Product } from "../models/product";
import {
  getProduct,
  getProducts,
  IProductPayload,
  createProduct,
  updateProduct,
  deleteProduct,
  IProductPatchPayload,
} from "../repositories/product.repository";

@Route("products")
@Tags("Product")
export default class ProductController {
  @Get("/")
  public async getProducts(): Promise<Array<Product>> {
    return getProducts();
  }

  @Security("JWT")
  @Post("/")
  public async createProduct(
    @Body() body: IProductPayload
  ): Promise<Product | { message: string } | null> {
    return createProduct(body);
  }

  @Security("JWT")
  @Get("/:id")
  public async getProduct(@Path() id: string): Promise<Product | null> {
    return getProduct(Number(id));
  }

  @Security("JWT")
  @Patch("/:id")
  public async updateProduct(
    @Path() id: string,
    @Body() body: IProductPatchPayload
  ): Promise<Product | { message: string }> {
    return updateProduct(Number(id), body);
  }

  @Security("JWT")
  @Delete("/:id")
  public async deleteProduct(@Path() id: string): Promise<DeleteResult> {
    return deleteProduct(Number(id));
  }
}
