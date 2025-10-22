import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { UserProyect } from '../../user_Proyetc/userProyect.entity';
import { Task } from '../Entities/task.entity';
import { State } from '../../State/state.entity';


@Entity('task_proyect')
export class TaskProyect extends Task {
  @ManyToOne(() => UserProyect, (userproyect) => userproyect.taskProyect, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_proyecto_id' })
  userProyect: UserProyect;

  @ManyToOne(() => State, (state) => state.taskProyect, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  state: State;
}