import bcrypt from "bcrypt";
import { dataSource } from "../config/database";
import { Role, User } from "../models/user";
import jwt from "jsonwebtoken";

export interface ISigninPayload {
  username: string;
  password: string;
}

export interface ISigninResponse {
  token?: string;
  role?: number;
  id?: number;
  deposit?: number;
  message?: string;
  error?: string;
}

export const login = async (
  payload: ISigninPayload
): Promise<ISigninResponse> => {
  const { username, password } = payload;
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({ where: { username } });
  if (!user) return {
    error: "User not found"
  };

  //Comparing passwords
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  // checking if password was valid and send response accordingly
  if (!passwordIsValid) {
    return {
      error: "Invalid password",
    };
  }
  
  //Signing token with user id
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.API_KEY || "",
    {
      expiresIn: 86400,
    }
  );

  return {
    token,
    id: user.id,
    role: user.role,
    deposit: user.deposit,
    message: "Login successfull",
  };
};
