import { Connection } from "typeorm";
import { recipes__recipe } from "../models/entities/recipesRecipe.entity";


export const recipeProviders = [{
    provide: 'RecipesRecipeRepositoryToken',
    useFactory: (connection: Connection) => connection.getRepository(recipes__recipe),
    inject: ['DbConnectionToken']
}];