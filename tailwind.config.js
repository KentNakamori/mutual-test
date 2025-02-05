/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./src/**/*.{js,jsx,ts,tsx,vue,html}",
	  "./public/index.html",
	],
	theme: {
	  extend: {
		colors: {
		  // ====== 1) 基本カラー + shadcn/ui用のセマンティックカラー ======
		  black: "#000000",
		  white: "#FFFFFF",
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
  
		  // ====== 2) グレースケール ======
		  gray: {
			50:  "#F9FAFB",
			100: "#F3F4F6",
			200: "#E5E7EB",
			300: "#D1D5DB",
			400: "#9CA3AF",
			500: "#6B7280", // 基準色(中程度)
			600: "#4B5563",
			700: "#374151",
			800: "#1F2937",
			900: "#111827"
		  },
  
		  // ====== 3) アクションカラー（レッド系: エラー / 注意喚起など） ======
		  red: {
			50:  "#FEF2F2",
			100: "#FEE2E2",
			200: "#FECACA",
			300: "#FCA5A5",
			400: "#F87171",
			500: "#EF4444",
			600: "#991B1B", // 落ち着いた赤
			700: "#B91C1C",
			800: "#DC2626",
			900: "#7F1D1D"
		  },
		},
  
		// ====== フォントサイズの拡張（UIガイドラインで定義） ======
		fontSize: {
		  sm:   ["0.875rem", { lineHeight: "1.625" }],
		  base: ["1rem",     { lineHeight: "1.625" }],
		  lg:   ["1.125rem", { lineHeight: "1.625" }],
		  xl:   ["1.25rem",  { lineHeight: "1.625" }],
		  "2xl": ["1.5rem",  { lineHeight: "1.625" }],
		},
  
		// shadcn/ui用の設定
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [
	  require("tailwindcss-animate"),
	  require("@tailwindcss/typography"),
	],
  };