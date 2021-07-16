import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataType } from '../types/database';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "user_num",
  })
  user_num: number;

  @Column({
    type: DataType.varchar,
    name: "user_account",
    length: 64,
  })
  user_account: string;
}
