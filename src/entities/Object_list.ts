import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DataType } from '../types/database';
import { Picture_objects } from './Picture_objects';

@Entity('Object_list')
export class Object_list {
  
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "object_num",
  })
  object__num: number;

  @Column({
    type: DataType.varchar,
    name: "object_name",
    length: 45,
  })
  object_name: string;

  @OneToMany(() => Picture_objects, picture_object => picture_object.picture_object_num)
  public picture_object!: Picture_objects[];
  
}