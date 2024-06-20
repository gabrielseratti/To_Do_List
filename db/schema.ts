import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod";

export const lists = pgTable('lists', {
    id: text('id').primaryKey(),
    plaidId: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
});

export const listsRelations = relations(lists, ({ many }) => ({
    tasks: many(tasks),
}));

export const insertListSchema = createInsertSchema(lists);

export const tasks = pgTable('tasks', {
    id: text('id').primaryKey(),
    notes: text('notes'),
    date: timestamp('date', { mode: 'date' }).notNull(),
    listId: text('list_id').references(() => lists.id, {
        onDelete: "cascade",
    }).notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
    list: one(lists, {
        fields: [tasks.listId],
        references: [lists.id],
    })
}));

export const insertTaskSchema = createInsertSchema(tasks, {
    date: z.coerce.date(),
});