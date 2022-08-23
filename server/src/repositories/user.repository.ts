import bcrypt from "bcrypt";
import { DeleteResult } from "typeorm";
import { dataSource } from "../config/database";
import { Role, User } from "../models/user";

export interface IUserPayload {
  username: string;
  password: string;
  role: Role;
  deposit: number;
}

export interface IUserPutPayload {
  username?: string;
  role?: Role;
  deposit?: number;
}

export const getUsers = async (): Promise<Array<User>> => {
  const userRepository = dataSource.getRepository(User);
  return userRepository.find();
};

export const getUser = async (id: number): Promise<User | null> => {
  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });
  if (!user) return null;
  return user;
};

export const createUser = async (payload: IUserPayload): Promise<User> => {
  const userRepository = dataSource.getRepository(User);
  const user = new User();

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  const hashed = await bcrypt.hash(payload.password, salt);

  return userRepository.save({
    ...user,
    ...payload,
    password: hashed,
  });
};

export const updateUser = async (
  id: number,
  payload: IUserPutPayload
): Promise<User | null> => {
  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });
  if (!user) {
    return null;
  }
  
  userRepository.merge(user, payload);
  return await userRepository.save(user);
};

export const deleteUser = async (id: number) => {
  const userRepository = dataSource.getRepository(User);
  return await userRepository.delete(id);
};
