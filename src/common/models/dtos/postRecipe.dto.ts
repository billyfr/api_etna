import { IsInt, IsString, IsArray, ValidateNested, IsDefined } from 'class-validator';
import { JsonProperty, JsonObject } from 'json2typescript';
import { UserDto } from './user.dto';

@JsonObject
export class AddRecipesDto {

    @JsonProperty('id', Number)
    @IsInt()
    public id?: number = undefined;

    @JsonProperty('name', String)
    @IsString()
    public name: string = undefined;

    @JsonProperty('user', UserDto)
    @ValidateNested()
    public user: UserDto = undefined;

    @JsonProperty('slug', String)
    @IsString()
    @IsDefined()
    public slug: string = undefined;

    @JsonProperty('step', [String])
    @IsArray()
    public step?: Array<string> = undefined;

}
