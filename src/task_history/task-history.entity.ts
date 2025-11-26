import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn} from 'typeorm';
import { TaskPersonal } from 'src/task/Entities/task-personal.entity';
import { TaskProyect } from 'src/task/Entities/task-proyect.entity';
import { State } from 'src/State/state.entity';

@Entity('task_history')
export class TaskHistory {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => TaskPersonal, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_personal_id' })
    taskPersonal?: TaskPersonal;
    
    @ManyToOne(() => TaskProyect, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_proyect_id' })
    taskProyect?: TaskProyect;
    
    @ManyToOne(() => State, {eager: true})
    @JoinColumn({ name: 'old_state_id' })
    previousState: State;
    
    @ManyToOne(() => State, {eager: true})
    @JoinColumn({ name: 'new_state_id' })
    newState: State;
    
    @CreateDateColumn()
    changedAt: Date;
}