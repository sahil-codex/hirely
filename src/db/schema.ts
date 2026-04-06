import { pgTable,uuid,text,integer,timestamp,uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:uuid("id").defaultRandom().primaryKey(),
  email: text( "email" ).notNull().unique(),
  passwordHash:text("password_hash").notNull(),
  role:text("role").notNull(),
  createdAt:timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs",{
    id:uuid("id").defaultRandom().primaryKey(),
    title:text("title").notNull(),
    description:text("description").notNull(),
    location:text("location"),
    salary:integer("salary"),
    skills:text("skills").array(),
    recruiterId: uuid("recruiter_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const profiles = pgTable("profiles",{
  id:uuid("id").defaultRandom().primaryKey(),
  userId:uuid("user_id").notNull(),
  name:text("name"),
  skills:text("skills").array().default([]),
  experience:integer("experience"),

})

export const applications = pgTable("applications",{
  id:uuid("id").defaultRandom().primaryKey(),
  userId:uuid("user_id").notNull(),
  jobId:uuid("job_id").notNull(),
  status:text("status").default("APPLIED").$type<"APPLIED"|"SHORTLISTED"|"REJECTED">(),
  createdAt:timestamp("created_At").defaultNow(),
  },
  (table)=>({uniqueUserJob:uniqueIndex("unique_user_job").on(
    table.userId,
    table.jobId
  ),})
);