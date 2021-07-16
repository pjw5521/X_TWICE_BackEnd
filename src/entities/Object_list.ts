import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataType } from '../types/database';

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

}

