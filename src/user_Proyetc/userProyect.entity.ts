import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Proyect } from "../proyect/proyect.entity";
import { User } from "../users/users.entity";
import {TaskProyect} from "../task/Entities/task-proyect.entity"


@Entity('user_proyect')
export class UserProyect {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Proyect, (proyect) => proyect.user_proyect)
    @JoinColumn({ name: 'proyect_id' })
    proyect: Proyect;

    @ManyToOne(() => User, (user) => user.user_proyect)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'enum',
        enum: ['MANAGER', 'COLABORATOR'],
        default: 'MANAGER',
      })
    rol: string;

    @OneToMany(() => TaskProyect, (taskProyect) => taskProyect.userProyect)
    taskProyect: TaskProyect[];
}
   
