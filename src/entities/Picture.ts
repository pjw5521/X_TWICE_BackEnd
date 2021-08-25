import { IsInt, IsOptional, IsString } from 'class-validator';
import { Entity, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { DataType } from '../types/database';
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
    name: "picture_directory",
    length: 100,
  })
  @IsString()
  picture_directory: string;

  @Column({
    type: DataType.varchar,
    name: "picture_name",
    length: 100,
  })
  @IsString()
  picture_name: string;

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

  @Column({
    type: DataType.text,
    name: "picture_vector",
    nullable: true

  })
  @IsString()
  picture_vector: string;

  @Column({
    type: DataType.float,
    name: "picture_norm",
    nullable: true
  })
  @IsInt()
  picture_norm: number;


  @ManyToOne(() => User, user => user.pictures)
  @JoinColumn({ name: "user_num", referencedColumnName: "user_num"})
  user: User;

  @OneToMany(() => Picture_object, picture_object => picture_object.picture)
  picture_objects: Picture_object[];
  
}