import { CARDS_TABLE, PERMISSION_TABLE, PROJECTS_TABLE, PROJECT_PERMISSION_TABLE, USER_TABLE } from './../knex-connection.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(CARDS_TABLE, (t) => {
            t.bigIncrements('id')
                .primary({ constraintName: 'card_pk' })
                .unsigned();
            t.string('rfid', 150);
            t.timestamps({ defaultToNow: true, useCamelCase: false });
        });

    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(USER_TABLE, (t) => {
            t.bigIncrements('id').primary({constraintName:'users_pk'}).unsigned();
            t.string('name', 255).notNullable();
            t.string('email', 255).notNullable();
            t.string('password', 255).notNullable();
            t.bigInteger('card_id').unsigned().nullable();
            t.string('permissions', 500).notNullable()
                .defaultTo('common-door');
            t.timestamps({ defaultToNow: true, useCamelCase: false });

            t.foreign('card_id', 'card_user_id')
                .references('id')
                .inTable(process.env.DB_NAME + '.' + CARDS_TABLE)
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });

    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(PROJECTS_TABLE, (t) => {
            t.bigIncrements('id').primary({ constraintName: 'projects_pk' }).unsigned();
            t.string('name', 255).notNullable();
            t.timestamps({ defaultToNow: true, useCamelCase: false });
        });

    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(PROJECT_PERMISSION_TABLE, (t) => {
            t.bigInteger('user_id').unsigned();
            t.bigInteger('project_id').unsigned();
            t.date('due_date').notNullable();
            t.timestamps({ defaultToNow: true, useCamelCase: false });

            t.primary(['user_id', 'project_id']);
            t.foreign('user_id', 'project_permission_user_id')
                .references('id')
                .inTable(process.env.DB_NAME + '.' + USER_TABLE)
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            t.foreign('project_id', 'user_project_permission_id')
                .references('id')
                .inTable(process.env.DB_NAME + '.' + PROJECTS_TABLE)
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
    
    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(PERMISSION_TABLE, (t) => {
            t.bigIncrements('id').unsigned().primary({ constraintName: 'permissions_pk' });
            t.string('name', 255).notNullable();
            t.string('description', 255).notNullable();
            t.string('code', 255).index('permissions_code').unique();
            t.timestamps({ defaultToNow: true, useCamelCase: false });
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.withSchema(process.env.DB_NAME)
        .dropTable(PROJECT_PERMISSION_TABLE)
        .dropTable(USER_TABLE)
        .dropTable(CARDS_TABLE)
        .dropTable(PROJECTS_TABLE)
        .dropTable(PERMISSION_TABLE);
};
