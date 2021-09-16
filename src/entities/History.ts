import { IsInt, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column,ManyToOne, JoinColumn } from 'typeorm';
import { DataType } from '../types/database';
import { User } from './User';

@Entity('Histories')
export class History {
    
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "history_num",
  })
  @IsInt()
  history_num: number;

  @Column({ 
    type: "timestamp", 
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP"
  })
  @IsString()
  createdAt: string;

  @Column({
    type: DataType.int,
    name: "user_num1",
  })
  @IsInt()
  user_num1: number;

  @Column({
    type: DataType.int,
    name: "user_num2",
  })
  @IsInt()
  user_num2: number;

  @Column({
    type: DataType.varchar,
    name: "picture_url",
    length: 250,
  })
  @IsString()
  picture_url: string;

  @Column({
    type: DataType.varchar,
    name: "picture_title",
    length: 45,
  })
  @IsString()
  picture_title: string;

  @Column({
    type: DataType.varchar,
    name: "token_id",
    length: 100,
  })
  @IsString()
  token_id: string;

  @Column({
    type: DataType.float,
    name: "picture_price",
  })
  @IsInt()
  picture_price: number;

  @ManyToOne(() => User, user => user.user_num)
  @JoinColumn({ name: "user_num1", referencedColumnName: "user_num" })
  user1: User;

  @ManyToOne(() => User, user => user.user_num)
  @JoinColumn({ name: "user_num2", referencedColumnName: "user_num" })
  user2: User;

}