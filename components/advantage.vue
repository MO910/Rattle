<template lang="pug">
v-row
    v-col(cols='4')
        v-card-text {{ayahs}}
    v-col.d-flex.justify-end.align-center(cols='8')
        v-slider.align-center(
            v-model='ayahs'
            min=1
            max=10
            ticks
            tick-size='5'
            hide-details
        )
    template(v-if='!disableRatting')
        v-col(cols='4')
            v-card-text grade: {{ ratingRatio ? ratingRatio * 10 : '--'}} / 10
        v-col.d-flex.justify-end.align-center(cols='8')
            v-rating.d-flex.justify-space-between.align-center(
                background-color="grey"
                color="blue"
                hover
                :half-increments='ratingLength < 10'
                :length="ratingLength"
                size="30"
                @input="changeRating"
                :value="ratingRatio * ratingLength"
            )
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    data: () => ({
        windowWidth: 1000,
        ratingRatio: 0,
        ayahs: 5,
    }),
    mounted() {
        // rating length
        this.windowWidth = window.innerWidth;
        window.onresize = () => {
            this.windowWidth = window.innerWidth;
        };
    },
    computed: {
        ratingLength() {
            return this.windowWidth > 960 ? 10 : 5;
        },
        disableRatting() {
            this.ratingRatio = 0;
            return this.ayahs != 10;
        },
    },
    methods: {
        changeRating(n) {
            this.ratingRatio = n / this.ratingLength;
        },
    },
};
</script>
