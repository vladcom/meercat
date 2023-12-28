import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import PushNotifications from "./view/components/PushNotifications/PushNotifications";

const container = document.getElementById('root');
const animation = document.querySelector<HTMLDivElement>('div[data-initial-splash="true"]');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <PushNotifications />
      <App />
    </React.StrictMode>
  );
  if (animation) {
    animation.style.visibility = 'hidden';
  }

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  serviceWorkerRegistration.register();

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  // reportWebVitals();
}
