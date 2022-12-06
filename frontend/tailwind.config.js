/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                theme: {
                    50: "#EEEBF9",
                    100: "#DEDAF0",
                    200: "#CCC2F3",
                    300: "#9F90D5",
                    400: "#877AB6",
                    500: "#756B99",
                    600: "#686181",
                    700: "#58536a",
                    800: "#47405F",
                    900: "#1D1735"
                }
            }
        }
    },
    plugins: []
}