import { Controller, Get, HttpCode, Param, Inject, HttpStatus, HttpException } from "@nestjs/common";
import { RecipesServices } from "../services/recipes.services";
import { Repository } from "typeorm";
import { recipes__recipe } from "../../common/models/entities/recipesRecipe.entity";

@Controller('recipes')
export class RecipeController {
    constructor(
        @Inject('RecipesRecipeRepositoryToken') private readonly recipesRepository: Repository<recipes__recipe>,
        private recipeServices: RecipesServices
    ) { }

    @Get(':slug')
    @HttpCode(200)
    async getRecipesBySlug(@Param('slug') slugParam: string) {
        const regex = /([\w-_]+).json/;
        let slug;
        try {
            slug = slugParam.match(regex)[1];
        } catch (error) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const recipe = await this.recipesRepository
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .where('recipes.slug = :slug', { slug: slug })
            .getOne();
        if (!recipe) {
            throw new HttpException({ error: 'Not Found' }, HttpStatus.NOT_FOUND);
        }
        this.recipeServices.setRecipes(recipe);
        return {
            code: 200,
            message: 'OK',
            datas: this.recipeServices.getRecipesBySlug()
        };
    }

    @Get(':slug/steps.json')
    @HttpCode(200)
    async getStepBySlug(@Param('slug') slugParam: string) {
        const recipes = await this.recipesRepository
            .createQueryBuilder('recipes')
            .where('recipes.slug = :slug', { slug: slugParam })
            .getOne();
        if (!recipes) {
            throw new HttpException({ error: 'Bad request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const steps = recipes.step.split(',');
        return {
            code: 200,
            message: 'OK',
            datas: steps
        };
    }
}