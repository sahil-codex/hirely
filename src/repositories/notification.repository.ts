import { db } from "@/lib/drizzle";
import { notifications } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

type CreateNotification = {
  userId: string;
  title: string;
  message: string;
  type: string;
};

export async function createNotification(
  data: CreateNotification
) {
  const result = await db
    .insert(notifications)
    .values({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
    })
    .returning();

  return result[0];
}

export async function getNotificationsByUser(
  userId: string
) {
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string
) {
  const result = await db
    .update(notifications)
    .set({
      read: true,
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId)
      )
    )
    .returning();

  return result[0] ?? null;
}

export async function markAllNotificationsAsRead(
  userId: string
) {
  return await db
    .update(notifications)
    .set({
      read: true,
    })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      )
    )
    .returning();
}