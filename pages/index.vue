<template>
    <div class="recent-posts" v-if="page.posts">
        <navbar></navbar>
        <b-row>
            <b-col offset-lg="3" lg="6" offset-md="2" md="8" offset-sm="1" sm="10">
                <b-card>
                    <b-list-group>
                        <b-list-group-item
                            v-for="post in page.posts"
                            :key="post.permalink"
                            :href="post.permalink"
                        >
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="text-primary">{{post.title}}</h5>
                                <small>{{formatDate(post.createdAt)}}</small>
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
    import Navbar from '../theme/components/navbar';

    export const data = {
        injectAllPosts: true
    };

    export default {
        components: {
            Navbar
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