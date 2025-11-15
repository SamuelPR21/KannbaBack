import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "src/users/users.entity";
import { Pet } from "./pet.entity";

@Entity('pet_feed')
export class PetFeed {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pet, (pet) => pet.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pet_id' })
    pet: Pet;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'fed_by_user_id' })
    user: User;

    @CreateDateColumn({ name: 'fed_at' })
    fedAt: Date;
}