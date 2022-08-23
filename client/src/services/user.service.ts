import axios from "axios";
import authHeader from "./authHeader";

export interface IUserPatchPayload {
  deposit?: number;
}

class UserService {
  getUser(id: number) {
    return axios.get(process.env.REACT_APP_API_URL + `/users/${id}`, {
      headers: authHeader(),
    });
  }

  deposit(amount: number) {
    return axios.post(
      process.env.REACT_APP_API_URL + `/deposit`,
      { amount },
      { headers: authHeader() },
    );
  }

  resetDeposit() {
    return axios.post(
      process.env.REACT_APP_API_URL + `/reset`,
      {},
      { headers: authHeader() },
    );
  }

  buy(products: number[]) {
    return axios.post(
      process.env.REACT_APP_API_URL + `/buy`,
      { products },
      { headers: authHeader() },
    );
  }
}
export default new UserService();
