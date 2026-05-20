const config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fef3f2',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
                accent: {
                    50: '#dbeafe',
                    100: '#bfdbfe',
                    200: '#93c5fd',
                    300: '#60a5fa',
                    400: '#3b82f6',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1e40af',
                },
                surface: {
                    page: '#fafafa',
                    card: '#ffffff',
                    muted: '#f4f4f5',
                    border: '#e4e4e7',
                },
                success: { 50: '#ecfdf5', 500: '#10b981', 700: '#047857' },
                warning: { 50: '#fefce8', 500: '#eab308', 700: '#a16207' },
                danger: { 50: '#fef2f2', 500: '#ef4444', 700: '#b91c1c' },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                soft: '0 8px 24px rgba(219,39,119,0.08)',
                elev: '0 12px 32px rgba(15,23,42,0.08)',
            },
            keyframes: {
                burst: {
                    '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                    '100%': { transform: 'translateY(-80px) scale(1.4)', opacity: '0' },
                },
                flip: {
                    '0%': { transform: 'rotateY(0)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                burst: 'burst 800ms ease-out forwards',
                flip: 'flip 350ms ease-in-out forwards',
                fadeIn: 'fadeIn 150ms ease-out',
            },
        },
    },
    plugins: [],
};
export default config;
