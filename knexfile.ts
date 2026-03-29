import type { Knex } from "knex";
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.development.local" });
loadEnv();

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
      directory: "./db/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./db/seeds",
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: "./db/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./db/seeds",
      extension: "ts",
    },
  },
};

export default config;
