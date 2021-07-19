import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DataType } from '../types/database';
import { History } from './History';
import { Picture } from './Picture';

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
  
  @OneToMany(() => History, history => history.history_num)
  history: History[];

  @OneToMany(() => Picture, picture => picture.token_id)
  picture: Picture[];
}