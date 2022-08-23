import axios from "axios";

class AuthService {
  async login(username: string, password: string) {
    const response = await axios.post(
      process.env.REACT_APP_API_URL + "/auth/login",
      {
        username,
        password,
      },
    );

    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, password: string, role: number) {
    return axios.post(process.env.REACT_APP_API_URL + "/users", {
      username,
      password,
      role,
    });
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
}

export default new AuthService();
