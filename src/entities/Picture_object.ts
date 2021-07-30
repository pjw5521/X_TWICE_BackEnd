
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DataType } from '../types/database';
import { Object_list } from './Object_list';
import { Picture } from './Picture';

@Entity('Picture_objects')
export class Picture_object {
  
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "picture_object_num",
  })
  picture_object_num: number;

  @Column({
    type: DataType.varchar,
    name: "token_id",
    length: 100
  })
  token_id: string;

  @Column({
    type: DataType.int,
    name: "object_num",
  })
  object_num: number;

  @ManyToOne(() => Picture, picture => picture.picture_objects)
  @JoinColumn({ name: "token_id", referencedColumnName: "token_id" })
  picture: Picture;

  @ManyToOne(() => Object_list, object_list => object_list.picture_objects)
  @JoinColumn({ name: "object_num", referencedColumnName: "object_num" })
  object_list: Object_list;

}