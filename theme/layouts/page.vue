<template>
    <div>
        <navbar></navbar>
        <slot name="default"></slot>
        <div class="recent-posts" v-if="page.posts">
            <ul>
                <li v-for="post in page.posts" :key="post.permalink">
                    <h2>
                        {{ formatDate(post.createdAt) }} -
                        <a :href="post.permalink">{{
                            post.title
                        }}</a>
                    </h2>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import navbar from '../components/navbar.vue'

    export default {
        components: {
            navbar
        },
        props: ['page'],
        methods: {
            formatDate(v) {
                const date = new Date(v);
                return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            }
        },
        head() {
            const pageTitle = this.page.title;
            return {
                title: pageTitle ?
                    `${pageTitle} - ${this.$siteConfig.title}` :
                    this.$siteConfig.title
            };
        }
    }
</script>