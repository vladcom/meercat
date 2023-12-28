import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import macrosPlugin from 'vite-plugin-babel-macros';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(), macrosPlugin()],
    build: {
      outDir: './build',
    },
    define: {
      'process.env': process.env,
    },
    server: {
      proxy: {
        '/api': {
          target: `${process.env.VITE_APP_BASE_URL}`,
          changeOrigin: true,
          secure: false,
        },
        '/tiles': {
          target: `${process.env.VITE_APP_BASE_URL}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/tiles/, ''),
        },
        '/socket': {
          target: `${process.env.VITE_APP_SOCKET}`,
          changeOrigin: true,
          secure: true,
          ws: true,
        },
      },
    },
  });
};
