/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#f7f7f6',
          100: '#e9e8e6',
          200: '#cfccc6',
          300: '#a8a39a',
          400: '#7c766b',
          500: '#5a544a',
          600: '#3f3b35',
          700: '#2a2723',
          800: '#1a1816',
          900: '#0e0d0c',
        },
        accent: {
          DEFAULT: '#ff5b35',
          dark:   '#e94a26',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.ink.700'),
            '--tw-prose-headings': theme('colors.ink.900'),
            '--tw-prose-links': theme('colors.accent.DEFAULT'),
            maxWidth: '68ch',
          },
        },
      }),
    },
  },
  plugins: [],
};
