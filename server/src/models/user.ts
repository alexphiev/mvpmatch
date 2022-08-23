import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";

export enum Role {
  BUYER = 0,
  SELLER = 1,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 0 })
  deposit!: number;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.BUYER,
  })
  role!: Role;

  @OneToMany(() => Product, (product: Product) => product.seller)
  products!: Array<Product>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
