/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
          "background-light" : "#eff3ff",
          "background-dark" : "#141d2d",

          "footer-light" : "#fefefe",
          "footer-dark" : "#0e1113",

          "footer-text-light" : "#4a5565",
          "footer-text-dark" : "#99a1af",

          "footer-button-light" : "#e5e7eb",
          "footer-button-dark" : "#364153",

          "form-light": "#ffffff",
          "form-dark": "#101828",

          "form-link-light" : "#432dd7",
          "form-link-dark" : "#83b3ff",

          "form-input-light" : "#f3f3f5",
          "form-input-dark" : "#1e2939",

          "form-button-light" : "#1c1b2a",
          "form-button-dark" : "#e3e3e5",

          "form-lable-light" : "#364153",
          "form-lable-dark" : "#99a1af",

          "form-placeholder-light" : "#717284",
          "form-placeholder-dark" : "#a1a197",

          "form-icon-background-light" : "#e0e7ff",
          "form-icon-background-dark" : "#312c85",

          "form-icon-light" : "#4f39f6",
          "form-icon-dark" : "#7c86ff",

          "form-error-light": "#fef2f2",
          "form-error-dark": "#271825",

          "navbar-light" : "#ffffff",
          "navbar-dark" : "#101828",

          "total-subject" : "#574cfc",
          "total-file" : "#00a9cd",
          "lecture-note" : "#a333ff",
          "pass-paper" : "#ef1d8a",

          "quick-action-light" : "#ffffff",
          "quick-action-dark" : "#101828",
      },
       keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
