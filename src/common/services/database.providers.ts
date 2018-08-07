import { createConnection } from 'typeorm';

export const databaseProviders = [{
    provide: 'DbConnectionToken',
    useFactory: async () => await createConnection({
        type: 'mysql',
        name: 'etna_rest',
        database: 'etna_rest',
        port: 3306,
        username: 'root',
        password: 'root',
        // synchronize: true,
        logging: true,
        entities: [
            __dirname + '/../models/**/*.entity{.ts,.js}'
        ]
    }),
}]