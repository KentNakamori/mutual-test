import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // 除外設定
    ignores: [
      ".next/**/*",           // Next.js自動生成ファイル
      "node_modules/**/*",    // node_modules
      "out/**/*",             // 出力フォルダ
      "dist/**/*",            // ビルドフォルダ
      "build/**/*",           // ビルドフォルダ
      "*.config.js",          // 設定ファイル
      "*.config.mjs",         // 設定ファイル
      "*.config.ts",          // 設定ファイル
      "tailwind.config.js",   // Tailwind設定
    ],
  },
  {
    // プラグイン設定
    plugins: {
      "unused-imports": unusedImports,
    },
    
    // ルール設定
    rules: {
      // 未使用import自動削除
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { 
          "vars": "all", 
          "varsIgnorePattern": "^_", 
          "args": "after-used", 
          "argsIgnorePattern": "^_" 
        }
      ],
      
      // 標準の未使用変数ルールを無効化（上記プラグインが代替）
      "@typescript-eslint/no-unused-vars": "off",
      
      // any型を警告レベルに（エラーではなく）
      "@typescript-eslint/no-explicit-any": "warn",
      
      // 空のオブジェクト型を警告レベルに
      "@typescript-eslint/no-empty-object-type": "warn",
      
      // 安全でない関数型を警告レベルに
      "@typescript-eslint/no-unsafe-function-type": "warn",
      
      // 未使用の式を警告レベルに
      "@typescript-eslint/no-unused-expressions": "warn",
      
      // ts-commentのルールを緩和
      "@typescript-eslint/ban-ts-comment": "warn",
      
      // React hooksの依存関係を警告レベルに
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.jsのimg要素警告を無効化（開発段階）
      "@next/next/no-img-element": "off",
      
      // require()の使用を警告レベルに
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
];

export default eslintConfig;
