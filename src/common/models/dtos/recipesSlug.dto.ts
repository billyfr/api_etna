import { JsonProperty, JsonObject } from "json2typescript";
import { IsInt, IsString, ValidateNested } from "class-validator";
import { UserDto } from "./user.dto";

@JsonObject
export class RecipesSlugDto {

    @JsonProperty('id')
    @IsInt()
    public id: number = undefined;

    @JsonProperty('name')
    @IsString()
    public name: string = undefined;

    @JsonProperty('user', UserDto)
    @ValidateNested()
    public user: UserDto = undefined;

    @JsonProperty('slug')
    @IsString()
    public slug: string = undefined;
}