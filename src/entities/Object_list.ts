import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DataType } from '../types/database';
import { Picture_object } from './Picture_object';

@Entity('Object_list')
export class Object_list {
  
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "object_num",
  })
  object_num: number;

  @Column({
    type: DataType.varchar,
    name: "object_name",
    length: 45,
  })
  object_name: string;

  @OneToMany(() => Picture_object, picture_object => picture_object.object_list)
  picture_objects: Picture_object[];
  
}