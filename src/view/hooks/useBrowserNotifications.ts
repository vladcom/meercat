import React from "react";

export function useBrowserNotifications() {
  const checkStatusNotificationsPermissions = () => {
    if (!("Notification" in window)) {
      return 'null';
    } else if (Notification.permission === "granted") {
      return 'granted';
    } else if (Notification.permission === "default") {
      return 'default';
    }
  };

  const askNotificationsPermissions = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return 'granted';
      } else {
        return 'null';
      }
    }).catch(() => {
      return 'null';
    })
  };

  return { askNotificationsPermissions, checkStatusNotificationsPermissions };
}
