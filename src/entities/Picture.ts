import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { DataType } from '../types/database';
import { Object_list } from './Object_list';
import { Picture_object } from './Picture_object';
import { User } from './User';

@Entity('Pictures')
export class Picture {
    
  @PrimaryColumn({
    type: DataType.varchar,
    name: "token_id",
    length: 100
  })
  @IsString()
  token_id: string;

  @Column({
    type: DataType.varchar,
    name: "picture_url",
    length: 100,
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
    name: "picture_category",
    length: 45,
  })
  @IsString()
  picture_category: string;

  @Column({
    type: DataType.varchar,
    name: "picture_state",
    default: "N",
    length: 10
  })
  @IsString()
  picture_state: string;

  @Column({
    type: DataType.varchar,
    name: "picture_info",
    length: 300,
  })
  @IsString()
  picture_info: string;

  @Column({
    type: DataType.int,
    name: "picture_price",
    default: 0
  })
  @IsOptional()
  picture_price: number;

  @Column({
    type: DataType.int,
    name: "picture_count",
    default: 0
  })
  picture_count: number;

  @Column({
    type: DataType.int,
    name: "user_num"
  })
  @IsInt()
  user_num: number;

  @ManyToOne(() => User, user => user.pictures)
  @JoinColumn({ name: "user_num", referencedColumnName: "user_num"})
  user: User;

  @OneToMany(() => Picture_object, picture_object => picture_object.picture)
  picture_objects: Picture_object[];
  
}