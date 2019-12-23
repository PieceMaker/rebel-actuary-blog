<template>
    <div class="recent-posts" v-if="page.posts">
        <navbar></navbar>
        <b-row>
            <b-col cols="4" offset="4">
                <b-card>
                    <b-list-group>
                        <b-list-group-item
                            v-for="post in page.posts"
                            :key="post.permalink"
                            :href="post.permalink"
                        >
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="text-primary">{{post.title}}</h5>
                                <small>{{formatDate(page.createdAt)}}</small>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import formatDate from '../util/formatDate';
    import navbar from '../theme/components/navbar';

    export const data = {
        injectAllPosts: true
    };

    export default {
        components: {
            navbar
        },
        props: ['page'],
        methods: {
            formatDate(date) {
                return formatDate(date);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .recent-posts {
        .row {
            padding-top: 50px;
        }
    }
</style>