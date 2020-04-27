module.exports = {
    plugins: [
        { resolve: 'saber-plugin-query-posts' }
    ],
    build: {
        publicUrl: '/rebel-actuary-blog/'
    },
    siteConfig: {
        title: 'Rebel Actuary Blog'
    },
    theme: './theme'
};