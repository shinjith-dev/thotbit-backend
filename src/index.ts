import { Hono } from 'hono'
import routes from './routes';

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  return c.text('Hey! There\'s nothing here for you, contact @shinjith_ (on instgram) if you need anything.')
})

app.route('/q', routes)

export default app
