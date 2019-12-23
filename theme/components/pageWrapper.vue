<template>
    <div class="page-wrapper">
        <b-row>
            <b-col cols="10" offset="1">
                <b-card>
                    <b-card-title class="text-center text-underline page-title">{{page.title}}</b-card-title>
                    <slot name="default"></slot>
                    <b-card-footer
                        class="text-center text-muted hide-background"
                        v-show="isPost"
                    >
                        Created: {{formatDate(page.createdAt)}}
                        <div v-show="isUpdated">
                            Updated: {{formatDate(page.updatedAt)}}
                        </div>
                    </b-card-footer>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
    .page-wrapper {
        padding-top: 50px;

        .card-body {
            padding-bottom: 0;
        }

        .hide-background {
            background-color: rgba(0,0,0,0);
        }

        .page-title {
            font-size: 2.5rem;
        }

        .text-underline {
            text-decoration: underline;
        }
    }
</style>

<script>
    import formatDate from '../../util/formatDate';

    export default {
        name: "PageWrapper",
        props: {
            page: {
                type: Object,
                default()
                {
                    return {};
                }
            }
        },
        computed: {
            isPost() {
                return this.page.type === 'post';
            },
            isUpdated() {
                return !!this.page.updated;
            }
        },
        methods: {
            formatDate(date) {
                return formatDate(date);
            }
        }
    }
</script>