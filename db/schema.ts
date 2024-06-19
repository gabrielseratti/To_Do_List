import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod"

export const lists = pgTable('lists', {
    id: text('id').primaryKey(),
    plaidId: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
});

export const insertListSchema = createInsertSchema(lists);