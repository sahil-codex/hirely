
import { pgTable,uuid,text,integer,timestamp,uniqueIndex,boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:uuid("id").defaultRandom().primaryKey(),
  fullName:text("full_name").notNull(),
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
  createdAt:timestamp("created_at").defaultNow(),
  },
  (table)=>({uniqueUserJob:uniqueIndex("unique_user_job").on(
    table.userId,
    table.jobId
  ),})
);

export const candidateProfiles = pgTable(
  "candidate_profiles",
{
  id:uuid("id").defaultRandom().primaryKey(),
  userId:uuid("user_id").references(()=>users.id,{
    onDelete:"cascade",
  })
   .notNull()
   .unique(),
   fullName:text("full_name"),
   headline:text("headline"),
   bio:text("bio"),
   location:text("location"),
   skills:text("skills").array().default([]),
   experience:integer("experience"),
   company:text("company"),
   education:text("education"),
   githubUrl:text("github_url"),
   linkedinUrl:text("linkedin_url"),
   portfolioUrl:text("portfolio_url"),
   resumeUrl:text("resume_url"),
   createdAt:timestamp("created_at").defaultNow().notNull(),
   updatedAt:timestamp("updated_at").defaultNow().notNull(),
},
);

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userJobUnique: uniqueIndex(
      "saved_jobs_user_job_idx"
    ).on(table.userId, table.jobId),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),

    message: text("message").notNull(),

    type: text("type").notNull(),

    read: boolean("read")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  }
);

export const recruiterProfiles = pgTable(
  "recruiter_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    headline: text("headline"),
    bio: text("bio"),
    location: text("location"),
    company: text("company"),
    jobTitle: text("job_title"),
    companyWebsite: text("company_website"),
    linkedinUrl: text("linkedin_url"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  }
);