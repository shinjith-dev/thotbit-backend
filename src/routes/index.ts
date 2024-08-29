import { Hono } from "hono";
import usersApp from "./users";
import { Context } from "../../lib/context";

const routes = new Hono<Context>();

routes.route("/users", usersApp);

export default routes;
