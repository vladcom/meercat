import { PropsWithChildren, useEffect } from "react";
import { isAuth, useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../../redux/auth";
import { requestForToken } from "../../../firebase/firebaseNotifications";
import { useAppSelector } from "../../../hooks/useRedux";
import { useBrowserNotifications } from "../../hooks/useBrowserNotifications";

export default function FirebaseNotificationsProvider({ children }: PropsWithChildren) {
  const isUserAuthorized = useAppSelector(isAuth);
  const { data: user } = useGetMyProfileQuery();
  const { checkStatusNotificationsPermissions } = useBrowserNotifications();
  const [update] = useUpdateMyProfileMutation();
  const isAllowedPush = user && user?.notificationsBy && user?.notificationsBy.includes('by-push');
  const userTokens = user && user?.tokens || [];

  useEffect(() => {
    if (isUserAuthorized && isAllowedPush && checkStatusNotificationsPermissions() === 'default') {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
          const currentToken: string | null = await requestForToken();
          if (currentToken) {
            const isTokenExist = userTokens.length && !!userTokens.find((i) => i === currentToken);
            if (!isTokenExist) {
              update({
                id: user!._id,
                tokens: [...userTokens, currentToken],
              });
            }
          }
        }
      })
    }
  }, [isUserAuthorized, isAllowedPush, userTokens, update]);

  return (
    <>
      {children}
    </>
  );
}
