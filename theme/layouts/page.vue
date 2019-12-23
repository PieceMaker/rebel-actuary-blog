<template>
    <div>
        <navbar></navbar>
        <page-wrapper :page="page">
            <slot name="default"></slot>
        </page-wrapper>
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