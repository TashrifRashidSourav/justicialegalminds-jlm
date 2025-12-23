import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './views/**/*.ejs',
        './public/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#C9A961',
                secondary: '#1a1a1a',
            },
            fontFamily: {
                serif: ['Georgia', 'serif'],
            },
        },
    },
    plugins: [],
};

export default config;
