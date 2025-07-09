import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"), // основной сайт
                admin: resolve(__dirname, "public/admin.html") // админка
            },
        },
    },
});