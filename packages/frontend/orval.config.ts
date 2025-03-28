import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  api: {
    input: {
      target: "./swagger/openapi.yml",
    },
    output: {
      mode: "tags-split",
      target: "./generated/api.ts",
      schemas: "./generated/model",
      client: "angular",
      clean: true,
      prettier: true,
      baseUrl: process.env["BACKEND_URL"],
    },
  },
});
