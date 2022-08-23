import axios from "axios";
import authHeader from "./authHeader";

export interface IProductPatchPayload {
  productName?: string;
  cost?: number;
  amountAvailable?: number;
  sellerId?: number;
}

class ProductService {
  addProduct(
    productName: string,
    cost: number,
    amountAvailable: number,
    sellerId: number,
  ) {
    return axios.post(
      process.env.REACT_APP_API_URL + "/products",
      {
        productName,
        cost,
        amountAvailable,
        sellerId,
      },
      {
        headers: authHeader(),
      },
    );
  }

  getProducts() {
    return axios.get(process.env.REACT_APP_API_URL + "/products", {
      headers: authHeader(),
    });
  }

  deleteProduct(id: number) {
    return axios.delete(process.env.REACT_APP_API_URL + `/products/${id}`, {
      headers: authHeader(),
    });
  }

  udateProduct(id: number, payload: IProductPatchPayload) {
    return axios.patch(
      process.env.REACT_APP_API_URL + `/products/${id}`,
      payload,
      { headers: authHeader() },
    );
  }
}
export default new ProductService();
