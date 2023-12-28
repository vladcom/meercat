import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { onMessageListener } from "../../../firebase/firebaseNotifications";

const PushNotifications: React.FC = () => {
  const [notification, setNotification] = useState({title: '', body: ''});
  const notify = () =>  toast(<ToastDisplay/>);
  function ToastDisplay() {
    return (
      <div>
        <p><b>{notification?.title}</b></p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title ){
      notify()
    }
  }, [notification])

  onMessageListener()
    // @ts-ignore
    .then(({ notification }) => {
      setNotification({title: notification?.title, body: notification?.body});
    })
    .catch((err) => console.log('failed: ', err));

  return <Toaster/>;
};

export default PushNotifications;
