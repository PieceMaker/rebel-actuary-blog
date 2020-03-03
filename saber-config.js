module.exports = {
    plugins: [
        { resolve: 'saber-plugin-query-posts' }
    ],
    build: {
        publicUrl: '/rebel-actuary-blog/'
    },
    siteConfig: {
        title: 'My Blog'
    },
    theme: './theme'
};