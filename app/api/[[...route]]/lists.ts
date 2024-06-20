import { db } from '@/db/drizzle';
import { lists, insertListSchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { createId } from "@paralleldrive/cuid2"
import { Hono } from 'hono'
import { HTTPException } from "hono/http-exception"
import { zValidator } from "@hono/zod-validator"
import { z } from 'zod';

const app = new Hono()
    .get(
        '/',
        clerkMiddleware(),
        async (c) => {
        const auth = getAuth(c);

        if (!auth?.userId) {
            return c.json({ error: "Unauthorized "}, 401);
        }

        const data = await db
            .select({
                id: lists.id,
                name: lists.name,
            })
            .from(lists)
            .where(eq(lists.userId, auth.userId))

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
                id: lists.id,
                name: lists.name,
            })
            .from(lists)
            .where(
                and(
                    eq(lists.userId, auth.userId),
                    eq(lists.id, id)
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
        zValidator("json", insertListSchema.pick({
            name: true,
        })),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [data] = await db.insert(lists).values({
                id: createId(),
                userId: auth.userId,
                ...values,
            }).returning();

            return c.json({ data });
    })
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

            const data = await db
            .delete(lists)
            .where(
                and(
                    eq(lists.userId, auth.userId),
                    inArray(lists.id, values.ids)
                )
            )
            .returning({
                id: lists.id,
            });

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
            insertListSchema.pick({
                name: true,
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

            const [data] = await db
                .update(lists)
                .set(values)
                .where(
                    and(
                        eq(lists.userId, auth.userId),
                        eq(lists.id, id),
                    ),
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

            const [data] = await db
                .delete(lists)
                .where(
                    and(
                        eq(lists.userId, auth.userId),
                        eq(lists.id, id),
                    ),
                )
                .returning({
                    id: lists.id,
                });
            
            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json ({ data });
        }
); 

app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app;