import { PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export abstract class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

}