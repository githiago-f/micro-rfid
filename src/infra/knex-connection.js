import knex from 'knex';
import { config } from 'dotenv';
import { join } from 'node:path';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
config({ path: join(__dirname, '../..', '.env'), debug: true });
import { Logger } from '../app/config/logger.js';

const logger = Logger('knex-db');

logger.info(`Test::${process.env.DB_NAME}`);

const connectionConfig = {
    debug: process.env.DB_DEBUG === 'true',
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST ?? 'localhost',
        database: process.env.DB_NAME ?? 'micro-rfid',
        password: process.env.DB_PASSWORD ?? 'password',
        user: process.env.DB_USER ?? 'user',
        port: Number(process.env.DB_PORT ?? '3306')
    },
    migrations: {
        directory: './migrations'
    },
    seeds: {
        directory: './seeds'
    },
    log: {
        debug: logger.debug.bind(logger),
        warn: logger.warn.bind(logger),
        error: logger.error.bind(logger)
    }
}; 

export default connectionConfig;  
export const connection = knex(connectionConfig);

export const USER_TABLE = 'users';
export const PERMISSION_TABLE = 'permissions';
export const PROJECTS_TABLE = 'projects';
export const CARDS_TABLE = 'cards';
export const PROJECT_PERMISSION_TABLE = 'project_permissions';
