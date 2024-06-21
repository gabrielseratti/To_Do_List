import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { subDays, parse, differenceInDays } from "date-fns";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
    // .get(
    //     '/',
    //     clerkMiddleware(),
    //     zValidator(
    //         'query',
    //         z.object({
    //             from: z.string().optional(),
    //             to: z.string().optional(),
    //             listId: z.string().optional(),
    //         }),
    //     ),
    //     async (c) => {
    //         const auth = getAuth(c);
    //         const { from, to, listId } = c.req.valid('query'); 

    //         if (!auth?.userId) {
    //             return c.json({ error: 'Unauthorized' }, 401);
    //         }

    //         const defaultTo = new Date();
    //         const defaultFrom = subDays(defaultTo, 30);

    //         const startDate = from
    //             ? parse(from, 'yyyy-MM-dd', new Date())
    //             : defaultFrom;
    //         const endDate = to
    //             ? parse(to, 'yyyy-MM-dd', new Date())
    //             : defaultTo;

    //         const periodLength = differenceInDays(endDate, startDate) + 1;
    //         const lastPeriodStart = subDays(startDate, periodLength);
    //         const lastPeriodEnd = subDays(endDate, periodLength);

    //         async function fetchTaskData(
    //             userId: string,
    //             startDate: Date,
    //             endDate: Date,
    //         ) {
    //             return await db
    //                 .select({
    //                     income: sql`SUM(CASE WHEN ${tasks.amount} >= 0)`,
    //                     resolved: '',
    //                     remaining: '',
    //                 })
    //         }

    //         const [currentPeriod] = await fetchTaskData(
    //             auth.userId,
    //             startDate,
    //             endDate,
    //         );

    //         const [lastPeriod] = await fetchTaskData(
    //             auth.userId,
    //             startDate,
    //             endDate,
    //         );
    //     },
    // );

export default app;