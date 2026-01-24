import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)", // Using CSS variables for flexibility
                foreground: "var(--foreground)",
                primary: "#0f766e", // Teal-700
                secondary: "#fca5a5", // Red-300
                accent: "#14b8a6", // Teal-500
                surface: "#f3f4f6", // Gray-100
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-out",
                "fade-in-up": "fade-in-up 0.7s ease-out",
            },
        },
    },
    plugins: [],
};
export default config;
