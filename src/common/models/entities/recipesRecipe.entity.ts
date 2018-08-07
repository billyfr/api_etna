import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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

    // @ManyToOne(type => users__user, u => u.recipes)
    // user: users__user;
}