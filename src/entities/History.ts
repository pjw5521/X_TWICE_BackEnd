import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataType } from '../types/database';

@Entity('Histories')
export class History {
    
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "history_num",
  })
  history_num: number;

  @Column({
    type: DataType.date,
    name: "date",
  })
  date: Date;

  @Column({
    type: DataType.int,
    name: "user_num1",
  })
  user_num1: number;

  @Column({
    type: DataType.int,
    name: "user_num2",
  })
  user_num2: number;

  @Column({
    type: DataType.varchar,
    name: "picture_url",
    length: 100,
  })
  picture_url: string;

  @Column({
    type: DataType.varchar,
    name: "picture_title",
    length: 45,
  })
  picture_title: string;

  @Column({
    type: "int",
    name: "picture_price",
  })
  picture_price: number;

}