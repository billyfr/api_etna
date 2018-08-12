import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { users__user } from "./usersUser.entity";

@Entity()
export class recipes__recipe {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    step: string;

    @ManyToOne(type => users__user, u => u.recipes)
    @JoinColumn({ name: 'user_id' })
    user: users__user;
}