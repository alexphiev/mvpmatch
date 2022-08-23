import { AxiosRequestHeaders } from "axios";

export default function authHeader(): AxiosRequestHeaders {
  const data = localStorage.getItem("user");

  if (data) {
    const user = JSON.parse(data);
    if (user && user.token) {
      return { Authorization: "Bearer " + user.token };
    }
  }
  return {};
}
