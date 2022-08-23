import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amountAvailable!: number;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0})
  cost!: number;

  @Column({ unique: true })
  productName!: string;

  @ManyToOne(() => User, (user: User) => user.products)
  @JoinColumn()
  seller!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
