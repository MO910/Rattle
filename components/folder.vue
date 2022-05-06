<template lang="pug">
    v-card.folder(:class='folder.color' router :to='router')
        v-icon {{folder.icon || icon}}
        .folderTitle.text-center(:class='folder.title_color') {{title}}
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({}),
    props: ["folder", "translation", "router", "icon"],
    computed: {
        title() {
            const { title, name } = this.folder;
            const val = title || name;
            if (this.translation) return this.$vuetify.lang.t(val);
            return val;
        },
    },
};
</script>
<style lang="sass">
.folder
    width: 50%
    height: inherit !important
    aspect-ratio: 1/1
    display: block
    margin: auto
    background: red
    border-radius: 15% !important
    text-decoration: none
    position: relative
    .v-icon
        width: 100%
        height: 100%
        font-size: 4em
    .folderTitle
        width: 100%
        font-size: 2.5em
        position: absolute
        bottom: -1.8em
        white-space: nowrap
</style>
