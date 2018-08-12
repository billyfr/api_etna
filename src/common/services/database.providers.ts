import { createConnection } from 'typeorm';

export const databaseProviders = [{
    provide: 'DbConnectionToken',
    useFactory: async () => await createConnection({
        type: 'postgres',
        name: 'default',
        // database: 'das7ul1a8vpo1t',
        url: 'postgres://denisprak:@localhost/postgres',
        // synchronize: true,
        logging: true,
        entities: [
            __dirname + '/../models/**/*.entity{.ts,.js}'
        ]
    }),
}]