import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm";
import {UserProyect} from "../user_Proyetc/userProyect.entity"
import {Category} from "../category/category.entity"

@Entity('proyects')
export class Proyect {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => UserProyect, (userProyect) => userProyect.proyect)
    user_proyect: UserProyect[];

    @ManyToOne(() => Category, (category) => category.proyects)
    category: Category;
   
}

