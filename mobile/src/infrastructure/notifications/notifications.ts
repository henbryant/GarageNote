import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // アプリが前面でも通知を表示
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const initializeNotifications = async () => {
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    await Notifications.requestPermissionsAsync();
  }
};

export const getNotificationPermission = async () => {
  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.granted) return 'granted';
  if (permissions.canAskAgain === false) return 'denied';
  return 'undetermined';
};

export const scheduleExpirationNotification = async (
  id: string,
  title: string,
  reminderDate: string,
  body: string,
) => {
  const triggerDate = new Date(reminderDate);
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: {
      title,
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
};

export const cancelExpirationNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
};
