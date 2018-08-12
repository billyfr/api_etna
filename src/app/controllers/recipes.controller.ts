import { Controller, Get, Inject, HttpCode, HttpException, HttpStatus, Param } from "@nestjs/common";
import { Repository } from "typeorm";
import { recipes__recipe } from "common/models/entities/recipesRecipe.entity";
import { RecipesServices } from "../services/recipes.services";

@Controller('recipes.json')
export class RecipesController {
    constructor(@Inject('RecipesRecipeRepositoryToken')
    private readonly recipesRepository: Repository<recipes__recipe>,
        private recipeServices: RecipesServices
    ) { }

    @Get()
    @HttpCode(200)
    async getAllRecipes() {
        const recipes: Array<recipes__recipe> = await this.recipesRepository.find();
        if (recipes) {
            this.recipeServices.setRecipes(recipes);
            return {
                code: 200,
                message: 'OK',
                datas: this.recipeServices.getRecipes()
            };
        } else {
            throw new HttpException({ error: 'Not Found' }, HttpStatus.NOT_FOUND);
        }
    }
}