// postcss.config.cjs
module.exports = {
    plugins: {
        '@tailwindcss/postcss': {
            tailwindcss: {}, // Добавляем явное указание на tailwindcss
        },
        autoprefixer: {},
    }
}