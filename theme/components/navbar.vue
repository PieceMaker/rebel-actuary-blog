<template>
    <b-navbar type="dark" variant="secondary">
        <b-navbar-nav>
            <b-nav-item href="/">Home</b-nav-item>
            <b-nav-item href="/about.html">About Me</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
            <b-nav-item href="https://github.com/PieceMaker">
                <fa :icon="[ 'fab', 'github' ]"></fa>
            </b-nav-item>
            <b-nav-item href="https://twitter.com/RebelActuary">
                <fa :icon="[ 'fab', 'twitter' ]"></fa>
            </b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
    export default {
        name: "Navbar"
    }
</script>

<style scoped>

</style>