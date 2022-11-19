<template lang="pug">
    .inputNumber.d-flex(:class='textColor' :id='id_key')
        v-icon.decrease(
            v-show='!freeze'
            :class='`${textColor} order-${isEn ? 0 : 2}`'
        ) {{arithmetic ? 'mdi-minus' : 'mdi-chevron-left'}}
        v-icon.increase(
            v-show='!freeze'
            :class='`${textColor} order-${isEn ? 2 : 0}`'
        ) {{arithmetic ? 'mdi-plus' : 'mdi-chevron-right'}}
        //- :open-on-click='true'
        v-tooltip(
            v-model='tooltip'
            :open-on-hover='false'
            top
            transition="scroll-y-transition"
        )
            template(v-slot:activator="{ on, attrs }")
                .content.mx-2(
                    :data-current='init' 
                    :data-before='+init - 1' 
                    :data-after='+init + 1'
                    :data-digitWidth='digitWidth'
                    :data-min='min'
                    :data-max='max'
                    :data-format='format'
                    :data-freeze='freeze'

                    :contenteditable='contenteditable'
                    :class='background'

                    @dblclick='contenteditable = true'
                    @doubleTap='contenteditable = true'
                    @blur='contenteditable = false'

                    @mousedown='tooltip = true'
                    @touchstart='tooltip = true'
                    @mouseup='tooltip = false'
                    @touchend='tooltip = false'
                ) 
                    div(v-text='init')
            span {{$vuetify.lang.t('$vuetify.drag2Arrow')}}
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
    data: () => ({
        contenteditable: false,
        tooltip: false,
    }),
    props: [
        "id_key",
        "model",
        "maxModel",
        "action",
        "background",
        "text_color",
        "init",
        "before",
        "after",
        "digitWidth",
        "min",
        "max",
        "format",
        "freeze",
        "arithmetic",
    ],
    mounted() {
        const content = $(`.inputNumber#${this.id_key} .content`);
        $(window).on("mouseup", () => (this.tooltip = false));
        // observer to update the store every time the current attr changed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // update the current model when change
                const newCurrent = mutation.target.dataset.current;
                this.updateModel([this.model, newCurrent]);
                //
                const newMax = mutation.target.dataset.max;
                // console.log("data-max", newMax);
                this.updateModel([this.maxModel, newMax]);
            });
        });
        observer.observe(content[0], {
            attributes: true,
            attributeFilter: ["data-current", "data-max"],
        });
        // initialize the function
        counter(content);
    },
    computed: {
        ...mapState(["books"]),
        textColor() {
            return this.text_color
                ?.split(" ")
                .map((c) => c + "--text")
                .join(" ");
        },
        isEn() {
            return this.$vuetify.lang.current == "en";
        },
    },
    methods: mapMutations(["updateModel"]),
};
</script>

<style scoped lang="sass">
@import "@/assets/inputNumber"
</style>
