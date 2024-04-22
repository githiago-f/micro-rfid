import { REQUESTS } from "../knex-connection.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.withSchema(process.env.DB_NAME)
        .createTable(REQUESTS, t => {
            t.bigIncrements('id')
                .primary({ constraintName: 'logs_id' })
                .unsigned();
            t.string('rfid', 150).index('rfid');
            t.enum('status', ['DENIED', 'ALLOWED']);
            t.boolean('viewed').defaultTo(false);
            t.timestamps({ defaultToNow: true, useCamelCase: false });
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.withSchema(process.env.DB_NAME)
        .dropTable(REQUESTS);
};
