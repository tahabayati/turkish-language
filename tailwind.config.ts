import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}"], theme: { extend: { fontFamily: { sans: ["Arial", "sans-serif"], mono: ["ui-monospace", "monospace"] } } }, plugins: [] } satisfies Config;
