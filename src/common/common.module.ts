import { Module } from '@nestjs/common';
import { databaseProviders } from './services/database.providers';
import { userProviders } from './services/user.provider';
import { recipeProviders } from './services/recipes.providers';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ...databaseProviders,
    ...userProviders,
    ...recipeProviders,
  ],
  exports: [
    ...databaseProviders,
    ...userProviders,
    ...recipeProviders,
  ]
})
export class CommonModule {}
