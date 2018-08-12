import { JsonProperty, JsonObject } from "json2typescript";
import { IsString, IsInt } from "class-validator";

@JsonObject
export class UserDto {

    @JsonProperty('username')
    @IsString()
    public username: string = undefined;

    @JsonProperty('last_login')
    @IsString()
    public last_login: string = undefined;

    @JsonProperty('id')
    @IsInt()
    public id: number = undefined;
}