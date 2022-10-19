<template lang="pug">
//- v-card.folder(:class='folder.color' router :to='router')
    v-icon {{folder.icon || icon}}
    .folderTitle.text-center(:class='folder.title_color') {{title}}
    
v-card.folder.d-flex.flex-column.justify-space-between(
    :to='router' nuxt
    v-ripple='false' flat
)
    //- v-btn(router text :to='router')
    v-avatar.mx-auto(:color='color' size='80')
        v-icon(x-large) {{folder.icon || icon}}
    .text-center.text-h5 {{title}}
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({}),
    props: ["folder", "translation", "router", "icon"],
    computed: {
        title() {
            const { title, first_name } = this.folder;
            const val = title || first_name || this.folder;
            if (this.translation) return this.$vuetify.lang.t(val);
            return val;
        },
        color() {
            return this.folder.color || "primary";
        },
    },
};
</script>
<style lang="sass">
.folder
    width: 50%
    // height: 100% !important
    aspect-ratio: 1/1
    background: none !important
    // display: block
    // margin: auto
    // margin-bottom: 6em
    // background: red
    // border-radius: 15% !important
    // text-decoration: none
    // position: relative
    // .v-icon
    //     width: 100%
    //     height: 100%
    //     font-size: 4em
    // .folderTitle
    //     width: 100%
    //     font-size: 2.5em
    //     position: absolute
    //     bottom: -1.8em
    //     white-space: nowrap
</style>
