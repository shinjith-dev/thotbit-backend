import { D1Adapter } from "@lucia-auth/adapter-sqlite";

export function initializeLucia(D1: D1Database) {
  return new D1Adapter(D1, {
    user: "user",
    session: "session"
  });
}


