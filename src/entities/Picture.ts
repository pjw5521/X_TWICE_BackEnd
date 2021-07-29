import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DataType } from '../types/database';
import { Object_list } from './Object_list';
import { Picture_objects } from './Picture_objects';
import { User } from './User';

@Entity('Pictures')
export class Picture {
    
  @PrimaryColumn({
    type: DataType.varchar,
    name: "token_id",
    length: 100
  })
  token_id: string;

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
    name: "picture_state",
    default: "N",
    length: 10
  })
  picture_state: string;

  @Column({
    type: DataType.varchar,
    name: "picture_info",
    length: 300,
  })
  picture_info: string;

  @Column({
    type: DataType.int,
    name: "picture_price",
    default: 0
  })
  picture_price: number;

  @Column({
    type: DataType.int,
    name: "picture_count",
    default: 0
  })
  picture_count: number;

  @ManyToOne(() => User, user_num => user_num.user_num)
  user_num: User;

  @OneToMany(() => Picture_objects, picture_object => picture_object.picture_object_num)
  public picture_object!: Picture_objects[];
  
}