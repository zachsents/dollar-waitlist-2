/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{tsx,jsx}",
        "./pages/**/*.{tsx,jsx}",
        "./server-modules/util.ts",
    ],
    theme: {
        extend: {
        },
    },
    plugins: [],
    darkMode: "class"
}