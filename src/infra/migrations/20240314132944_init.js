import { CARDS_TABLE, USER_TABLE } from './../knex-connection.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(CARDS_TABLE, (t) => {
            t.bigIncrements('id').primary({constraintName:'card_pk'}).unsigned();
            t.timestamps({ defaultToNow: true, useCamelCase: true });
        })

    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(USER_TABLE, (t) => {
            t.bigIncrements('id').primary({constraintName:'users_pk'}).unsigned();
            t.string('name', 1000).notNullable();
            t.string('email', 250).notNullable();
            t.string('password', 100).notNullable();
            t.string('card_id', 150).nullable();
            t.string('permissions', 250).notNullable().defaultTo('common-door')
            t.timestamps({ defaultToNow: true, useCamelCase: true });

            t.foreign('card_id', 'card_user_id')
                .references('id')
                .inTable(process.env.DB_NAME + '.' + USER_TABLE)
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.withSchema(process.env.DB_NAME)
        .dropTable(USER_TABLE)
        .dropTable(CARDS_TABLE);
};
