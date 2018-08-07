import { Connection } from "typeorm";
import { users__user } from "../models/entities/usersUser.entity";

export const userProviders = [{
    provide: 'UsersUserRepositoryToken',
    useFactory: (connection: Connection) => connection.getRepository(users__user),
    inject: ['DbConnectionToken']
}];