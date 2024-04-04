import { PERMISSION_TABLE, USER_TABLE } from '../knex-connection.js';
import { enc } from '../utils/encript.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex(PERMISSION_TABLE).insert([
        {
            code: 'dashboard',
            name: 'Dashboard',
            description: 'Allows user to access micro-rfid\'s dashboard'
        },
        {
            code: 'door-full',
            name: 'Full access to doors',
            description: 'Allows user to access doors without attending any classes, util for teachers and authorized users'
        },
        {
            code: 'common-door',
            name: 'Common access to door',
            description: 'Allows user to access doors while attending classes'
        }
    ]);
    await knex(USER_TABLE).insert({
        permissions: ['dashboard', 'door-full'].toString(),
        name: 'admin',
        card_id: null,
        default_password: true,
        email: 'admin@admin.com',
        password: await enc('admin123')
    });
}
