import { DataSource } from "typeorm";
import { Product } from "../models/product";
import { User } from "../models/user";

export const dataSource: DataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "postgres",
  entities: [Product, User],
  synchronize: true,
  logging: true,
});
