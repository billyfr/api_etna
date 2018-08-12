import { Injectable } from '@nestjs/common';
import * as debug from 'debug';
import * as dotenv from 'dotenv';
const cfenv = require('cfenv');
const logger = debug('app:EnvConfig');

@Injectable()
export class EnvConfig {
    public appEnv: any;

    constructor() {
        this.init();
    }

    public init(): void {
        let localConfig;

        try {
            localConfig = require('../../../VCAP_SERVICES.json');
            dotenv.config();

            localConfig = {
                vcap: {
                    services: localConfig,
                },
            };
        } catch (error) {
            logger('No local conf found => Assume current env is a cf one');
        }

        try {
            this.appEnv = cfenv.getAppEnv(localConfig);

            if (this.appEnv.isLocal) {
                console.log(process.env.PORT);

                this.appEnv.port = process.env.PORT;
            }
        } catch (error) {
            logger(`Error while loading configuration : ${error}`);
        }
    }
}