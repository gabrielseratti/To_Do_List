import { Hono } from 'hono'

import lists from './lists'
import tasks from './tasks' 
import summary from './summary' 
import { handle } from 'hono/vercel'

export const runtime = 'edge';

const app = new Hono().basePath('/api'); 

const routes = app
    .route('/lists', lists)
    .route('/tasks', tasks)
    .route('/summary', summary);

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;