import { Hono } from "hono";
import { Context } from "../../lib/context";
import { DatabaseUser } from "lucia";
import { verify } from "@node-rs/argon2";
import { lucia } from "../../lib/lucia";

const usersRouter = new Hono<Context>();

usersRouter.get("/", async (c) => {
  const user = c.get("user");

  if (!user)
    return c.json(
      { message: "You must be authenticated to perform this action!" },
      401,
    );

  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM user").all();
    return c.json({ message: "Fetched users", data: results });
  } catch (e: any) {
    return c.json({ message: "Failed to fetch users", error: e.message }, 500);
  }
});

usersRouter.get("/me", async (c) => {
  const user = c.get("user");

  if (!user)
    return c.json(
      { message: "You must be authenticated to perform this action!" },
      401,
    );

  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM user WHERE id = ?",
    )
      .bind(user.id)
      .all();
    return c.json({ message: "Fetched user info", data: results });
  } catch (e: any) {
    return c.json({ message: "Failed to fetch user", error: e.message }, 500);
  }
});

usersRouter.post("/", async (c) => {
  const body = await c.req.parseBody<{
    username: string;
    password: string;
  }>();

  const username: string | null = body.username ?? null;
  if (
    !username ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return c.json({ message: "Invalid username or password" }, 400);
  }

  const password: string | null = body.password ?? null;
  if (!password || password.length < 6 || password.length > 255) {
    return c.json({ message: "Invalid username or password" }, 400);
  }

  const existingUser = (await c.env.DB.prepare(
    "SELECT * FROM user WHERE username = ?",
  )
    .bind(username)
    .all()) as DatabaseUser[];
  if (!existingUser) {
    return c.json({ message: "Invalid username or password" }, 400);
  }

  const validPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return c.json({ message: "Invalid username or password" }, 400);
  }

  const l = lucia(c.env.DB);

  const session = await l.createSession(existingUser[0].id, {});
  c.header("Set-Cookie", l.createSessionCookie(session.id).serialize(), {
    append: true,
  });
  c.header("Location", "/", { append: true });
  return c.redirect("/");
});

export default usersRouter;
