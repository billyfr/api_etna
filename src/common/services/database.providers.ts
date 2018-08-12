import { EnvConfig } from './envConfig.service';
import { createConnection } from 'typeorm';

const config: EnvConfig = new EnvConfig();

export const databaseProviders = [{
    provide: 'DbConnectionToken',
    useFactory: async () => await createConnection({
        type: 'postgres',
        name: 'default',
        url: process.env.DATABASE_URL,
        logging: true,
        entities: [
            __dirname + '/../models/**/*.entity{.ts,.js}'
        ]
    }),
}]