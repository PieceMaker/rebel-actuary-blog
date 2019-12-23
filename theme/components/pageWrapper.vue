<template>
    <div class="page-wrapper">
        <b-row>
            <b-col cols="10" offset="1">
                <b-card>
                    <b-card-title class="text-center">{{page.title}}</b-card-title>
                    <slot name="default"></slot>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<style lang="scss" scoped>
    .page-wrapper {
        padding-top: 50px;
    }
</style>

<script>
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
        }
    }
</script>