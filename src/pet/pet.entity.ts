import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { User } from "../users/users.entity";


@Entity('pet')
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ['GATO', 'PERRO'],
        default: 'GATO',
      })
    type: string;

    @Column({
        type: 'enum',
        enum: ['FELIZ', 'CONTENTO', 'HAMBIRENTO', 'CONTETO'],
        default: 'HAMBIRENTO',
      })
    state: string;

    @Column()
    weightKg: number;

    @Column()
    date_last_meal: Date;
    
    @OneToOne(() => User, (user) => user.pet)
    user: User;
}