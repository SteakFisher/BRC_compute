import { sql } from "drizzle-orm";
import {decimal, jsonb, pgTable, text, timestamp, uuid, boolean} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(),
    username: text().notNull().unique(),
    email: text().notNull().unique(),
    github_repo: text().notNull(),
    role: text().notNull().default("participant"),
});

export const submissionTable = pgTable("submissions", {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid().notNull().references(() => userTable.id),
    commit_hash: text().notNull(),
    commit_status: text(),
    commit_description: text(),
    runtime: decimal(),
    parsed_json: jsonb(),
    raw_json: jsonb(),
    is_upgrade: boolean().default(false),
    timestamp: timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const InsertUser = typeof userTable.$inferInsert;
export const User = typeof userTable.$inferSelect;

export const InsertSubmission = typeof submissionTable.$inferInsert;
export const Submission = typeof submissionTable.$inferSelect;