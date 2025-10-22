import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { State } from '../../State/state.entity';
import { Task } from './task.entity';
import { User } from '../../users/users.entity'

@Entity('task_personal')
export class TaskPersonal extends Task {

    @ManyToOne(() => User, (user) => user.taskpersonal, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;


    @ManyToOne(() => State, (state) => state.taskPersonal, { eager: true })
    @JoinColumn({ name: 'estado_id' })
    state: State;
}