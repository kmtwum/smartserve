import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("bookings", (table) => {
    table.uuid("group_id").nullable(); // Nullable to not break any existing rows
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("bookings", (table) => {
    table.dropColumn("group_id");
  });
}
