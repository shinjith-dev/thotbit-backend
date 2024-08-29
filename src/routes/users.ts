import { Hono } from "hono";
import { Bindings } from "..";

const usersApp = new Hono<{ Bindings: Bindings }>();

usersApp.get('/', async (c) => {
  try {
    let { results } = await c.env.DB.prepare(
      "SELECT * FROM users",
    )
      .all();
    return c.json({ message: "Fetched users", data: results });
  } catch (e: any) {
    return c.json({ message: "Failed to fetch users", error: e.message }, 500);
  }
})

export default usersApp
