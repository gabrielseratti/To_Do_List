import { Hono } from 'hono'

import lists from './lists'
import tasks from "./tasks"
import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono/vercel'

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json({ error: "Internal error" }, 500)
})

const routes = app
    .route('/lists', lists)
    .route('/tasks', tasks);

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;