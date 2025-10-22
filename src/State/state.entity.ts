import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TaskPersonal } from '../task/Entities/task-personal.entity';
import { TaskProyect } from '../task/Entities/task-proyect.entity';

@Entity('state')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['BACKLOG', 'TO_DO', 'DOING', 'DONE'],
    default: 'BACKLOG',
  })
    name: string;

  @OneToMany(() => TaskPersonal, (taskPersonal) => taskPersonal.state)
  taskPersonal: TaskPersonal[];

  @OneToMany(() => TaskProyect, (taskProyect) => taskProyect.state)
  taskProyect: TaskProyect[];
}
