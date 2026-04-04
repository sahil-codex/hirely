import { pgTable,uuid,text,integer,timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:uuid("id").defaultRandom().primaryKey(),
  email: text( "email" ).notNull().unique(),
  passwordHash:text("passwrod_hash").notNull(),
  role:text("role").notNull(),
  createdAt:timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs",{
    id:uuid("id").defaultRandom().primaryKey(),
    title:text("text").notNull(),
    description:text("description").notNull(),
    location:text("location"),
    salary:integer("salary"),
    recruiterId: integer("recruiter_id"),
    createAt: timestamp("created_at").defaultNow(),
})