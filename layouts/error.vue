<template lang="pug">
div
    h1(v-if="error.statusCode === 404") {{ pageNotFound }}
    h1(v-else) {{ otherError }}
    NuxtLink(to="/") Home page
</template>

<script>
export default {
    name: "EmptyLayout",
    layout: "empty",
    props: {
        error: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            pageNotFound: "404 Not Found",
            otherError:
                "Sorry ... An error occurred\n Could you just try to reload the page",
        };
    },
    head() {
        const title =
            this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
        return {
            title,
        };
    },
};
</script>

<style scoped></style>
