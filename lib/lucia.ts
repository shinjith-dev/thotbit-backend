import { Lucia } from "lucia";
import { initializeLucia } from "./db";

export const lucia = (D1: D1Database) => new Lucia(initializeLucia(D1))

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DBUser;
  }
}

export interface DBUser {
  username: string;
  profile_url: string | null;
  name: string | null;
  about: string | null;
  location: string | null;
}
