/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    daisyui: {
      themes: [
        {
          mytheme: {
            "primary": "#2563eb",       // Your primary color
            "secondary": "#64748b",     // Your secondary color
            "accent": "#1f2937",        // Accent color
            "neutral": "#f3f4f6",       // Neutral color
            "base-100": "#ffffff",      // Base background color (white)
            "info": "#3b82f6",
            "success": "#10b981",
            "warning": "#f59e0b",
            "error": "#ef4444",
  
            // Override component colors
            "--rounded-box": "1rem",
            "--rounded-btn": "0.5rem",
            "--btn-text-case": "none",
            "--navbar-padding": "0.5rem",
            "--border-btn": "1px",
            "--tab-border": "1px",
            "--tab-radius": "0.5rem",
          },
        },
        // Include other themes if necessary
      ],
    },
  },
  plugins: [require('daisyui')],
};
