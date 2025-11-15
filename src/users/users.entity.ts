import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { Pet } from "../pet/entities/pet.entity";
import { UserProyect } from "../user_Proyetc/userProyect.entity";
import { TaskPersonal } from "../task/Entities/task-personal.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true })
    username: string;
    
    @Column({unique: true })
    email: string;

    @Column()
    nameComlpete: string;

    @Column()
    password: string;

    @Column()
    oficio: string;

    @Column()
    dateOfBirth: Date;

    @Column({
        type: 'enum',
        enum: ['ESTUDIO', 'TRABAJO', 'PERSONAL'],
        default: 'ESTUDIO',
      })
    purpose: string;

    @OneToOne(() => Pet, (pet) => pet.user)
    @JoinColumn()
    pet: Pet;

    @OneToMany(() => UserProyect, (userProyect) => userProyect.user)
    user_proyect: UserProyect[];

    @OneToMany(() => TaskPersonal, (taskPersonal) => taskPersonal.user)
    taskpersonal: TaskPersonal[];
}