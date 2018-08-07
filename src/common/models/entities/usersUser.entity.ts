import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { recipes__recipe } from "./recipesRecipe.entity";

@Entity()
export class users__user {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    last_login: string;

    @Column()
    password: string;

    // @OneToMany(type => recipes__recipe, r => r.user)
    // recipes: recipes__recipe[];
}