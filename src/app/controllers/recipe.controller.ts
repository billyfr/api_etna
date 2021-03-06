import { AddRecipesDto } from './../../common/models/dtos/postRecipe.dto';
import { AuthGuard } from './../guards/authorization.guard';
import { users__user } from './../../common/models/entities/usersUser.entity';
import { Controller, Get, HttpCode, Param, Inject, HttpStatus, HttpException, Put, UseGuards, Body, Req, Delete, ValidationPipe } from "@nestjs/common";
import { RecipesServices } from "../services/recipes.services";
import { Repository, Table } from "typeorm";
import { recipes__recipe } from "../../common/models/entities/recipesRecipe.entity";
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';

@Controller('recipes')
export class RecipeController {
    constructor(
        @Inject('UsersUserRepositoryToken') private readonly userRepository: Repository<users__user>,
        @Inject('RecipesRecipeRepositoryToken') private readonly recipesRepository: Repository<recipes__recipe>,
        private recipeServices: RecipesServices
    ) { }

    @Get(':slug')
    @HttpCode(200)
    // @UseGuards(AuthGuard)
    async getRecipesBySlug(@Param('slug') slugParam: string) {
        const regex = /^([\w-_]+).json/;
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
            throw new HttpException({ error: 'Not Found' }, HttpStatus.NOT_FOUND);
        }
        const steps = recipes.step.split(',');
        let step = [];
        steps.forEach((s, index, tab) => {
            if (index < tab.length - 1) {
                step.push(s);
            }
        });
        return {
            code: 200,
            message: 'OK',
            datas: step
        };
    }

    @Put(':name')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async modifyRecipe(@Body() body: any, @Req() req: any, @Param('name') param: string) {
        const regex = /^([\w-_]+).json/;
        let recipeParam;
        let jsonConvert: JsonConvert = new JsonConvert();
        // jsonConvert.operationMode = OperationMode.LOGGING;
        jsonConvert.ignorePrimitiveChecks = false;
        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
        try {
            recipeParam = param.match(regex);
        } catch (error) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        if (!recipeParam) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({ where: { password: req.headers['authorization'] } });
        if (!user) {
            throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
        }
        const recipe = await this.recipesRepository
            .createQueryBuilder('recipe')
            .leftJoinAndSelect('recipe.user', 'user')
            .where('recipe.slug = :name', { name: recipeParam[1] })
            .getOne();
        if (!recipe) {
            throw new HttpException({ error: 'Not Found', datas: [] }, HttpStatus.NOT_FOUND);
        }
        if (recipe.user.password !== req.headers['authorization']) {
            throw new HttpException({ error: 'Forbidden' }, HttpStatus.FORBIDDEN);
        }
        if ((body.name.length === 0 || body.name === '') || (body.slug.length === 0 || body.slug === '') ||
            (body.step.length === 0 || body.step === '')) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const _recipe = new recipes__recipe();
        const _user = new users__user();
        let sp = '';
        if (body.step) {
            body.step.forEach(s => {
                sp = sp.concat(s, ',');
            });
        }

        // const reciped = jsonConvert.serialize(recipe);
        _user.last_login = new Date(Date.now()).toISOString();
        _user.id = user.id;
        _user.email = user.email;
        _user.username = user.username;
        // _recipe.id = recipe.id;
        // _recipe.name = body.name || recipe.name;
        // _recipe.slug = body.slug || recipe.slug;
        // _recipe.step = sp || recipe.step;
        // _recipe.user = _user;
        _recipe.id = recipe.id;
        _recipe.name = body.name ? body.name : recipe.name
        _recipe.slug = body.slug ? body.slug : recipe.slug;
        _recipe.step = sp.length === 0 ? recipe.step : sp;
        _recipe.user = _user;
        let updateRecipe;
        try {
            updateRecipe = await this.recipesRepository.save(_recipe);
        } catch (error) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        console.log(jsonConvert.serializeObject(updateRecipe));

        delete updateRecipe.user.email;
        this.recipeServices.setRecipes(updateRecipe);
        const step = updateRecipe.step.split(',')
        updateRecipe.step = [];
        console.log(updateRecipe);

        step.forEach((s, index, tqb) => {
            if (index < Table.length) {
                updateRecipe.step.push(s);
            }
        });
        return {
            code: 200,
            message: 'OK',
            datas: updateRecipe
        }
    }

    @Delete(':slug')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    async deleteRecipe(@Param('slug') slug: string, @Req() req: any) {
        const regex = /^([\w-_]+).json/;
        let recipeParam;
        try {
            recipeParam = slug.match(regex)[1];
        } catch (error) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({ where: { password: req.headers['authorization'] } });
        if (!user) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const recipe = await this.recipesRepository
            .createQueryBuilder('recipe')
            .where('slug = :slug', { slug: recipeParam })
            .getOne();

        if (!recipe) {
            throw new HttpException({ error: 'Not Found' }, HttpStatus.NOT_FOUND);
        }
        if (recipe.user.password !== req.headers['authorization']) {
            throw new HttpException({ error: 'Forbidden' }, HttpStatus.FORBIDDEN);
        }
        const deleteRecipe = await this.recipesRepository.delete(recipe);
        if (deleteRecipe.raw.length === 0) {
            return {
                code: 200,
                message: 'success',
                datas: { id: recipe.id }
            };

        }
    }
}