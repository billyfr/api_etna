import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { databaseProviders } from './../common/services/database.providers';
import { userProviders } from './../common/services/user.provider';
import { UsersController } from './controllers/users.controller';
import { recipeProviders } from './../common/services/recipes.providers';
import { RecipesController } from './controllers/recipes.controller';
import { RecipesServices } from './services/recipes.services';

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    RecipesController,
  ],
  providers: [
    AppService,
    RecipesServices,
    ...databaseProviders,
    ...userProviders,
    ...recipeProviders,
  ],
})
export class AppModule { }
