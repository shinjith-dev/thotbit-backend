import type { Env } from "hono";
import type { User, Session } from "lucia";

type Bindings = {
  DB: D1Database;
};

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
  Bindings: Bindings
}
