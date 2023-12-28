/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_IPSTACK_API_KEY: string;
  readonly VITE_APP_GOOGLE: string;
  readonly VITE_APP_SOCKET_INCIDENTS: string;
  readonly VITE_APP_MAPBOX: string;
  readonly VITE_APP_SOCKET: string;
  readonly VITE_APP_RADIUS_FOR_CREATING_INCIDENT: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
