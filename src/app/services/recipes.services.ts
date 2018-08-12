import { Injectable } from "@nestjs/common";
import { RecipesDto } from "./../../common/models/dtos/recipesRecipe.dto";
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';
import { RecipesSlugDto } from "./../../common/models/dtos/recipesSlug.dto";

@Injectable()
export class RecipesServices {
    private recipes;

    constructor() {

    }

    setRecipes(recipes) {
        this.recipes = recipes;
    }

    getRecipes(): RecipesDto[] {
        const recipesDto: RecipesDto[] = [];
        let jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.operationMode = OperationMode.LOGGING;
        jsonConvert.ignorePrimitiveChecks = false;
        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
        this.recipes.forEach(r => {
            let dto: RecipesDto;
            try {
                dto = jsonConvert.deserialize(r, RecipesDto);
            } catch (error) {
                throw new Error(error);
            };
            recipesDto.push(dto);
        });
        return recipesDto;
    }

    getRecipesBySlug(): RecipesSlugDto {
        let jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.operationMode = OperationMode.LOGGING;
        jsonConvert.ignorePrimitiveChecks = false;
        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
        const dto = jsonConvert.deserialize(this.recipes, RecipesSlugDto);
        return dto;
    }
}