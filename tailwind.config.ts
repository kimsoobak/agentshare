import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050510',
        surface: '#0d0d1a',
        surface2: '#12122a',
        accent: '#9945ff',
        'accent-dark': '#7a2fe0',
        accent2: '#14f195',
        text: '#f0f0ff',
        mid: '#9090b8',
        muted: '#55556a',
        card: '#0d0d1a',
        border: 'rgba(153,69,255,0.15)',
        green: '#14f195',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Inter"',
          '"Pretendard"',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #9945ff 0%, #14f195 100%)',
        'gradient-sol': 'linear-gradient(90deg, #9945ff, #14f195)',
      },
    },
  },
  plugins: [],
}

export default config
