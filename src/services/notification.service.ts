import {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/repositories/notification.repository";

type AuthUser = {
  userId: string;
  role: string;
};

export async function createNotificationService(
  data: {
    userId: string;
    title: string;
    message: string;
    type: string;
  }
) {
  return await createNotification(data);
}

export async function getNotificationsService(
  user: AuthUser
) {
  return await getNotificationsByUser(
    user.userId
  );
}

export async function markNotificationReadService(
  user: AuthUser,
  notificationId: string
) {
  if (!notificationId) {
    throw new Error(
      "Notification ID is required"
    );
  }

  const notification =
    await markNotificationAsRead(
      user.userId,
      notificationId
    );

  if (!notification) {
    throw new Error(
      "Notification not found"
    );
  }

  return notification;
}

export async function markAllNotificationsReadService(
  user: AuthUser
) {
  return await markAllNotificationsAsRead(
    user.userId
  );
}