import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProyect } from '../user_Proyetc/userProyect.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @OneToMany(() => UserProyect, (userProyect) => userProyect.role)
  userProyects: UserProyect[];
}