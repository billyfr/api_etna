import { AuthGuard } from './../guards/authorization.guard';
import { Controller, Get, Inject, HttpCode, HttpException, HttpStatus, Param, Post, Body, Req, UseGuards, Put, Query } from "@nestjs/common";
import { Repository, Like } from "typeorm";
import { recipes__recipe } from "./../../common/models/entities/recipesRecipe.entity";
import { RecipesServices } from "../services/recipes.services";
import { users__user } from './../../common/models/entities/usersUser.entity';
import * as s from 'shortid';

@Controller('recipes.json')
export class RecipesController {
    constructor(
        @Inject('RecipesRecipeRepositoryToken') private readonly recipesRepository: Repository<recipes__recipe>,
        @Inject('UsersUserRepositoryToken') private readonly userRepository: Repository<users__user>,
        private recipeServices: RecipesServices
    ) { }

    @Get()
    @HttpCode(200)
    async getAllRecipes(@Query() query?: any) {
        const options: any = {
        };
        console.log(query);

        if (query.name) {
            options.name = Like(`%${query.name.toString()}%`);
        } if (query.id) {
            options.where = {
                id: query.id
            };
        } if (query.slug) {
            options.slug = Like(`%${query.slug.toString()}%`);
        }

        const recipes: Array<recipes__recipe> = await this.recipesRepository.find(options);
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

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard)
    async addRecipe(@Body() body: any, @Req() req: any) {
        const pwd = req.headers['authorization'];
        const options = {
            where: {
                password: pwd
            }
        };
        if (Object.keys(body).length === 0) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        const _user: users__user = await this.userRepository.findOne(options);
        if (!_user) {
            throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
        }
        const recipe = new recipes__recipe();
        const user = new users__user();
        if (body.slug) {
            recipe.slug = body.slug;
        } else {
            recipe.slug = body.name.concat('_', s.generate());
        }
        let sp = '';
        body.step.forEach(s => {
            sp = sp.concat(s, ',');
        });

        recipe.name = body.name;
        recipe.step = sp;
        user.id = _user.id;
        user.username = _user.username;
        user.email = _user.email;
        user.last_login = new Date(Date.now()).toISOString();
        recipe.user = user;
        let recipeSave;
        try {
            recipeSave = await this.recipesRepository.save(recipe);
            await this.userRepository.update(user.id, { last_login: new Date(Date.now()).toISOString() });
        } catch (error) {
            throw new HttpException({ error: 'Bad Request', datas: [] }, HttpStatus.BAD_REQUEST);
        }
        this.recipeServices.setRecipes(recipeSave);
        return {
            code: 201,
            message: 'Created',
            datas: this.recipeServices.getRecipe()
        };

    }
}