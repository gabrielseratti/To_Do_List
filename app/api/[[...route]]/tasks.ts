import { db } from '@/db/drizzle';
import { tasks, insertTaskSchema, lists } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { createId } from "@paralleldrive/cuid2"
import { Hono } from 'hono'
import { zValidator } from "@hono/zod-validator"
import { z } from 'zod';
import { subDays, parse } from 'date-fns';

const app = new Hono()
    .get(
        '/',
        zValidator('query', z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            listId: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
        const auth = getAuth(c);
        const { from, to, listId } = c.req.valid('query');

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized "}, 401);
        }

        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from 
            ? parse(from, 'yyyy-MM-dd', new Date())
            : defaultFrom;

        const endDate = to
            ? parse(to, 'yyyy-MM-dd', new Date())
            : defaultTo;

        const data = await db
            .select({
                id: tasks.id,
                date: tasks.date,
                notes: tasks.notes,
                list: lists.name,
                listId: tasks.listId,
            })
            .from(tasks)
            .innerJoin(lists, eq(tasks.listId, lists.id))
            .where(
                and(
                    listId ? eq(tasks.listId, listId) : undefined,
                    eq(lists.userId, auth.userId),
                    gte(tasks.date, startDate),
                    lte(tasks.date, endDate),
                )
            )
            .orderBy(desc(tasks.date));

        return c.json({ data });
    })
    .get(
        '/:id',
        zValidator('param', z.object({
            id: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ error: 'Missing id' }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const [data] = await db
            .select({
                id: tasks.id,
                date: tasks.date,
                notes: tasks.notes,
                listId: tasks.listId,
            })
            .from(tasks)
            .innerJoin(lists, eq(tasks.listId, lists.id))
            .where(
                and(
                    eq(tasks.id, id),
                    eq(lists.userId, auth.userId),
                ),
            );

            if (!data) {
                return c.json({ error: 'Not found' }, 404);
            }

            return c.json({ data });
        }
    )
    .post("/", 
        clerkMiddleware(),
        zValidator("json", insertTaskSchema.omit({
            id: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db.insert(tasks).values({
                id: createId(),
                ...values,
            }).returning();

            return c.json({ data });
    })
    .post(
        'bulk-create',
        clerkMiddleware(),
        zValidator(
            'json',
            z.array(
                insertTaskSchema.omit({
                    id: true,
                }),
            ),
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid('json');

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .insert(tasks)
                .values(
                    values.map((value) => ({
                        id: createId(),
                        ...value,
                    }))
                )
                .returning();

            return c.json({ data });
        },
    )
    .post(
        '/bulk-delete',
        clerkMiddleware(),
        zValidator(
            'json',
            z.object({
                ids: z.array(z.string()),
            }),
        ),

        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid('json');

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const tasksToDelete = db.$with('tasks_to_delete').as(
                db.select({ id: tasks.id }).from(tasks)
                    .innerJoin(lists, eq(tasks.listId, lists.id))
                    .where(and(
                        inArray(tasks.id, values.ids),
                        eq(lists.userId, auth.userId),
                    )),
            );

            const data = await db
                .with(tasksToDelete)
                .delete(tasks) 
                .where(
                    inArray(tasks.id, sql`(select id from ${tasksToDelete})`)
                )
                .returning({
                    id: tasks.id,
                })

            return c.json({ data });
        }
    )
    .patch(
        '/:id',
        clerkMiddleware(),
        zValidator(
            'param',
            z.object({
                id: z.string().optional(),
            }),
        ),
        zValidator(
            'json',
            insertTaskSchema.omit({
                id: true,
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid('param');
            const values = c.req.valid('json');

            if (!id) {
                return c.json({ error: 'missing id' }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const tasksToUpdate = db.$with('tasks_to_update').as(
                db.select({ id: tasks.id })
                    .from(tasks)
                    .innerJoin(lists, eq(tasks.listId, lists.id))
                    .where(and(
                        eq(tasks.id, id),
                        eq(lists.userId, auth.userId),
                    )),
            );

            const [data] = await db
                .with(tasksToUpdate)
                .update(tasks)
                .set(values)
                .where(
                    inArray(tasks.id, sql`(select id from ${tasksToUpdate})`)
                )
                .returning();
            
            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json ({ data });
        }
    )
    .delete(
        '/:id',
        clerkMiddleware(),
        zValidator(
            'param',
            z.object({
                id: z.string().optional(),
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid('param');

            if (!id) {
                return c.json({ error: 'Missing id' }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const tasksToDelete = db.$with('tasks_to_delete').as(
                db.select({ id: tasks.id })
                    .from(tasks)
                    .innerJoin(lists, eq(tasks.listId, lists.id))
                    .where(and(
                        eq(tasks.id, id),
                        eq(lists.userId, auth.userId),
                    )),
            );

            const [data] = await db
                .with(tasksToDelete)
                .delete(tasks)
                .where(
                    inArray(
                        tasks.id,
                        sql`(select id from ${tasksToDelete})`
                    ),
                )
                .returning({
                    id: tasks.id,
                });
            
            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json ({ data });
        }
); 

app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app;