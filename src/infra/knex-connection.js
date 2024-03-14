import knex from 'knex';
import { Logger } from '../app/config/logger.js';

const logger = Logger('knex-db');

const config = {
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

export default config;  
export const db = knex(config);
export const USER_TABLE = 'users';
export const PERMISSION_TABLE = 'permissions';
export const PROJECTS_TABLE = 'projects';
export const CARDS_TABLE = 'cards';
export const PROJECT_PERMISSION_TABLE = 'project_permissions';
