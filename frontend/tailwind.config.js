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
            },
            animation: {
                "delayed-fade-out": "fade-out .3s ease-out 2.5s forwards",
                "slide-in": "slide-in .3s cubic-bezier(0.075, 0.820, 0.165, 1.000)",
            },
            keyframes: {
                "fade-out": {
                    "from": { opacity: 1 },
                    "to": { opacity: 0 }
                },
                "slide-in": {
                    "from": { transform: "translateY(-100%)", opacity: .5 },
                    "to": { transform: "translateY(0)", opacity: 1 }
                }
            }
        }
    },
    plugins: []
}