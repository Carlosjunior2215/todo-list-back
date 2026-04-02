import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ length: 80 })
  name: string;

  @ApiProperty()
  @Column({ length: 80 })
  email: string;

  @ApiProperty()
  @Column({ length: 100 })
  password: string;
}
