/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      colors: {

        'ai-m': '#16191a',
        'ai-m-g': '#232627',
        'ai-background': '#151515',
        'ai-conversation-page': '#232627',
        'ai-conversation-ai': '#151618',
        'ai-conversation-me': '#2b2f30',
        'ai-conversation-border': '#3a3e3f',

        'ai-b': '#11151C',
        'ai-bp': '#19212E',
        'ai-t': '#313C51',
        'ai-l': '#212D40',
        'ai-button': '#6b3bf3',
        // 'ai-chat-me': '#404046',
        'ai-chat-me': '#4b4b4d',
        'ai-in-t': '#485265',
        'ai-bt-hover': '#3D4B66',
        'ai-disabled': '#595959',
        'ai-orange': '#dc9414',
        'ai-light': '#a8a8a8'

        // 'ai-b': '#171c34',
        // 'ai-bp': '#2e325c',
        // 'ai-t': '#737aae',
        // 'ai-l': '#26284b',
        // 'ai-button': '#6b3bf3',
        // // 'ai-chat-me': '#404046',
        // 'ai-chat-me': '#4b4b4d',




        // 'ai-b': '#2d2d2d',
        // 'ai-bp': '#3c3c3c',
        // 'ai-t': '#a8a8a8',
        // 'ai-l': '#3c3c3c',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
