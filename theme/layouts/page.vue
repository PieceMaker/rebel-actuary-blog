<template>
    <div>
        <navbar></navbar>
        <page-wrapper :page="page">
            <slot name="default"></slot>
        </page-wrapper>
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
    import formatDate from '../../util/formatDate';
    import navbar from '../components/navbar.vue'
    import PageWrapper from "../components/pageWrapper";

    export default {
        components: {
            navbar,
            PageWrapper
        },
        props: ['page'],
        methods: {
            formatDate(created) {
                return formatDate(created);
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