import knex, { Knex } from "knex";
import config from "../../knexfile";

const environment = process.env.NODE_ENV || "development";
const connectionConfig = config[environment as keyof typeof config];

let cachedConnection: Knex | null = null;

export function getDb(): Knex {
  if (!cachedConnection) {
    cachedConnection = knex(connectionConfig);
  }
  return cachedConnection;
}

export default getDb();
