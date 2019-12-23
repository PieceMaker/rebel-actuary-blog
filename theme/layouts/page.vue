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
    import Navbar from '../components/navbar'
    import PageWrapper from "../components/pageWrapper";

    export default {
        components: {
            Navbar,
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