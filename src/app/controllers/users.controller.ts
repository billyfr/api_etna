import { Controller, Get, Inject } from "@nestjs/common";
import { users__user } from "common/models/entities/usersUser.entity";
import { Repository } from "typeorm";

@Controller('users')
export class UsersController {
    constructor(@Inject('UsersUserRepositoryToken') private readonly userRepository: Repository<users__user>) {}

    @Get()
    async getUsers() {
        return await this.userRepository.find();
    }
}