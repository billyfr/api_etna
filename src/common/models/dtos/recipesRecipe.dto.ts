import { IsInt, IsString, IsArray } from 'class-validator';
import { JsonProperty, JsonObject } from 'json2typescript';

@JsonObject
export class RecipesDto {

    @JsonProperty('id', Number)
    @IsInt()
    public id: number = undefined;

    @JsonProperty('name', String)
    @IsString()
    public name: string = undefined;

    @JsonProperty('slug', String)
    @IsString()
    public slug: string = undefined;

}