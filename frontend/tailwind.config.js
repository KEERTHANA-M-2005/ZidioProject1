/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6b21a8",         // Elegant Purple
        secondary: "#facc15",       // Gold
        accent: "#f3e8ff",          // Lavender
        background: "#faf5ff",      // Light Purple
        text: "#4b5563",            // Grayish Blue
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Optional: use a nice font
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),     // For form styles
    // require('@tailwindcss/typography') // For prose and content formatting
  ],
};
