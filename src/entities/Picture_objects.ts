
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DataType } from '../types/database';
import { Object_list } from './Object_list';
import { Picture } from './Picture';

@Entity('Picture_objects')
export class Picture_objects {
  
  @PrimaryGeneratedColumn({
    type: DataType.int,
    name: "picture_object_num",
  })
  picture_object_num: number;

  @ManyToOne(() => Picture, picture => picture.token_id)
  @JoinColumn({ name: "token_id" })
  picture: Picture;

  @ManyToOne(() => Object_list, object_list => object_list.object__num)
  @JoinColumn({ name: "object_num" })
  object_list: Object_list;

}