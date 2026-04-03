import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("bookings", (table) => {
    table.integer("quantity").notNullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("bookings", (table) => {
    table.dropColumn("quantity");
  });
}
