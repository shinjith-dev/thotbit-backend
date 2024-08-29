import { Hono } from "hono";
import { Bindings } from "..";
import usersApp from "./users";

const routes = new Hono<{ Bindings: Bindings }>();

routes.route('/users', usersApp)

export default routes
