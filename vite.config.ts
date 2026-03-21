import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isNetlify = process.env.NETLIFY === "true";
const isCloudflarePages = process.env.CF_PAGES === "1";

export default defineConfig({
  plugins: [react()],
  base: isNetlify || isCloudflarePages ? "/" : "/true-north-rising/",
});