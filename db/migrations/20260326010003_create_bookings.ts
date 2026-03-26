import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("bookings", (table) => {
    table.increments("id").primary();
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("service_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("services")
      .onDelete("CASCADE");
    table.date("date").notNullable();
    table.string("time_slot", 5).notNullable(); // HH:mm format
    table
      .enu("status", ["pending", "confirmed", "cancelled"])
      .notNullable()
      .defaultTo("pending");
    table
      .enu("payment_status", ["pending", "paid"])
      .notNullable()
      .defaultTo("pending");
    table.timestamps(true, true);

    // Prevent double booking: one booking per date+time_slot
    table.unique(["date", "time_slot"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("bookings");
}
