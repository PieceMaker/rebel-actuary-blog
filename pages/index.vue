<template>
    <div>
        <h1>My Blog</h1>
        <p>This is my lovely (not yet) homepage!</p>
    </div>
</template>

<script>
    export const data = {
        layout: 'page',
        injectAllPosts: true
    };

    export default {
        props: ['page']
    }
</script>