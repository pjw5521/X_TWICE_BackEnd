import { IsHash, IsInt, IsNumber, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { DataType } from '../types/database';
import { History } from './History';
import { Picture } from './Picture';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "user_num",
  })
  @IsInt()
  user_num: number;

  @Column({
    type: DataType.varchar,
    name: "user_account",
    length: 255,
  })
  @IsString()
  user_account: string;

  @Column({
    type: DataType.varchar,
    name: "user_id",
    length: 20,
  })
  @Index({unique: true})
  @IsString()
  user_id: string;

  @Column({
    type: DataType.int,
    name: "user_clay",
    default: 100
  })
  @IsNumber()
  user_clay: number;

  @Column({
    type: DataType.varchar,
    name: "user_password",
    length: 255,
    default : "test",
  })
  user_password: string;
  
  @Column({
    type: DataType.varchar,
    name: "user_privatekey",
    length: 255,
    default : "test",
    // select: true
  })
  user_privatekey: string;

  @OneToMany(() => History, history => history.user1)
  histories1: History[];

  @OneToMany(() => History, history => history.user2)
  histories2: History[];

  @OneToMany(() => Picture, picture => picture.user)
  pictures: Picture[];
}