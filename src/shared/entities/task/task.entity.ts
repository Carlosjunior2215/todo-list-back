import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column({ length: 80 })
  name: string;

  @ApiProperty()
  @Column({ length: 256 })
  description: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @ApiProperty()
  @Column({ name: 'create_date', type: 'datetime'})
  create_date: string;

  @ApiProperty()
  @Column({ name: 'user_id' })
  user_id: number;
}
