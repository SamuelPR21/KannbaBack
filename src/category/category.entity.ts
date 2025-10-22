import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm";
import {Proyect} from "../proyect/proyect.entity"


@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Proyect, (proyect) => proyect.category)
    proyects: Proyect[];
}

