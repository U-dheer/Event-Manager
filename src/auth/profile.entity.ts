import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  age: number;
}
