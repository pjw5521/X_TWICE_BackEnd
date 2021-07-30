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

  @Column({
    type: DataType.varchar,
    name: "user_id",
    length: 20,
  })
  user_id: string;

  @Column({
    type: DataType.varchar,
    name: "user_password",
    length: 255,
  })
  user_password: string;
  
  @OneToMany(() => History, history => history.user1)
  histories1: History[];

  @OneToMany(() => History, history => history.user2)
  histories2: History[];

  @OneToMany(() => Picture, picture => picture.user)
  pictures: Picture[];
}