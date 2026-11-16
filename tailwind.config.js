// Tailwind config for the landing page. Rebuild the CSS after editing classes:
//   printf '@tailwind base;@tailwind components;@tailwind utilities;' | npx tailwindcss@3 -c tailwind.config.js -i - -o tailwind.css --minify
module.exports = Object.assign({
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        'neo-bg': 'var(--bg-color)',
                        'neo-text': 'var(--text-color)',
                        'neo-dark': '#18181B', 
                        'neo-rust': '#C2410C', 
                        'neo-blue': '#1E3A8A',
                        'neo-gray': '#E5E7EB',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                    },
                    boxShadow: {
                        'neo': '5px 5px 0px 0px #18181B',
                        'neo-hover': '2px 2px 0px 0px #18181B',
                    }
                }
            }
        }, { content: ['./index.html', './script.js'] });
