import { Hono } from "hono";
import routes from "./routes";
import { verifyRequestOrigin } from "lucia";
import { lucia } from "../lib/lucia";
import { Context } from "../lib/context";

const app = new Hono<Context>();

app.use("*", async (c, next) => {
  if (c.req.method === "GET") {
    return next();
  }
  const originHeader = c.req.header("Origin") ?? null;
  const hostHeader = c.req.header("Host") ?? null;
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return c.body(null, 403);
  }
  return next();
});

app.use("*", async (c, next) => {
  const l = lucia(c.env.DB);
  const sessionId = l.readSessionCookie(c.req.header("Cookie") ?? "");
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await l.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", l.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header("Set-Cookie", l.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("session", session);
  c.set("user", user);
  return next();
});

app.get("/", (c) => {
  return c.text(
    "Hey! There's nothing here for you, contact @shinjith_ (on instgram) if you need anything.",
  );
});

app.route("/q", routes);

export default app;
