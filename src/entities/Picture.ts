import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataType } from '../types/database';

@Entity('Pictures')
export class History {
    
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "token_id",
  })
  token_id: number;

  @Column({
    type: DataType.int,
    name: "user_num",
  })
  user_num: number;

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
    type: DataType.varchar,
    name: "picture_category",
    length: 45,
  })
  picture_category: string;

  @Column({
    type: DataType.varchar,
    name: "picture_info",
    length: 300,
  })
  picture_info: string;

  @Column({
    type: DataType.int,
    name: "picture_price",
  })
  picture_price: number;

}