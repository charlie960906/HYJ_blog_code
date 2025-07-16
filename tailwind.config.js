/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/posts/**/*.md',
    './src/data/staticPages.ts'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
