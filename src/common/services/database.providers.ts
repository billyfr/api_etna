import { createConnection } from 'typeorm';

const test = 0;

export const databaseProviders = [{
    provide: 'DbConnectionToken',
    useFactory: async () => await createConnection({
        type: 'postgres',
        name: 'default',
        url: 'postgres://mlfresfpzomtcq:5def83e28f25d3c24f71fb8aa0a3b5ef43c59030fe702429d3c085b752cfcde5@ec2-54-235-94-36.compute-1.amazonaws.com:5432/das7ul1a8vpo1t',
        logging: true,
        entities: [
            __dirname + '/../models/**/*.entity{.ts,.js}'
        ]
    }),
}]