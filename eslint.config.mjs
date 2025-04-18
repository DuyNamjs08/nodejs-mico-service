import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    ignores: ["**/node_modules/**", "**/dist/**", "**/logs/**"], // Thêm các thư mục cần ignore
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Chỉ dùng globals của Node.js nếu không dùng browser
        // Thêm các global variables tự định nghĩa nếu cần
      },
    },
    rules: {
      // Thêm rules tùy chỉnh
      "no-unused-vars": "warn",
      "no-console": "off",
      indent: ["error", 2],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-useless-catch": "off",
      "no-case-declarations": "off",
    },
  },
]);
