import type { Knex } from "knex";
import path from "path";

const config: Record<string, Knex.Config> = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "smartserve",
    },
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(__dirname, "db", "seeds"),
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.join(__dirname, "db", "seeds"),
      extension: "ts",
    },
  },
};

export default config;
