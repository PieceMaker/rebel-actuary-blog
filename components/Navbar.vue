<template>
    <nav>
        <h1>My Blog</h1>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about.html">About me</a></li>
        </ul>
    </nav>
</template>

<style scoped>
    nav {
        display: flex;
        height: 30px;
        align-items: center;
        border-bottom: 3px solid #f0f0f0;
    }

    /*Converts list from bullets to in-line*/
    nav ul li{
        display: inline-block;
    }
</style>