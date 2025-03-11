import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: process.env.NODE_ENV === 'production' ? '/vue-demo/' : '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    server: {
        port: 3000,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '.cert/key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '.cert/cert.pem')),
        },
        proxy: {
            // '/csrf-cookie': {
            //   target: 'https://dev.178778.xyz',
            //   changeOrigin: true,
            //   secure: false,
            //   xfwd: true
            // },      
            '/apis': {
                target: 'https://dev.178778.xyz',
                changeOrigin: true,
                secure: false,
                xfwd: true,
                rewrite: function (path) { return path.replace(/^\/apis/, ''); }
            }
        }
    }
});
