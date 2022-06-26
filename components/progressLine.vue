<template lang="pug">
    v-tooltip(
        v-model='tooltip' bottom
        transition="scroll-y-transition"
    )
        template(v-slot:activator="{ on, attrs }")
            svg.progress(
                @mouseover='tooltip = true'
                @mouseleave='tooltip = false'
                viewBox="0 0 30 165" fill="none" xmlns="http://www.w3.org/2000/svg"
            )
                clipPath#progressClip
                    rect(x="0" :y="value" width="100%" height="100%")
                <path id='curser' d="M14.5 157.665C12.5 156.51 12.5 153.623 14.5 152.469L25 146.406C27 145.252 29.5 146.695 29.5 149.004V161.129C29.5 163.438 27 164.882 25 163.727L14.5 157.665Z" fill="#6E6E6E"/>
                <path d="M5 5V159.5" stroke="#6E6E6E" stroke-width="10" stroke-linecap="round"/>
                <path id='bar' d="M5 5V159.5" stroke="white" stroke-width="10" stroke-linecap="round"/>
        span {{formatPoint(tooltipText)}}
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
    props: ["totalAyahs", "action", "user_id", "goal_id"],
    mounted() {
        const progress = document.querySelector(".progress"),
            curser = document.querySelector("#curser"),
            progressClip = document.querySelector("#progressClip rect");
        let holding = false,
            wasDown = false;
        // calc preset
        const calcCurserPreset = (e) => {
            if (e.clientY < progress.getBoundingClientRect().top) return 100;
            let present = e.layerY / progress.parentNode.offsetHeight;
            present = Math.max(0, present);
            present = Math.min(present, 1);
            return ~~((1 - present) * 100);
        };
        // mouse down
        progress.addEventListener("mousedown", (e) => {
            holding = this.tooltip = wasDown = true;
            updateProgress(e);
        });
        // mouse up
        window.addEventListener("mouseup", () => {
            if (!wasDown) return;
            const progress =
                this.tooltipText.ayah - this.totalAyahs.current.ayah;
            holding = this.tooltip = false;
            console.log(this.goal_id);
            if (progress)
                this.updateGoalsHistory({
                    user_id: this.user_id,
                    goal_id: this.goal_id,
                    progress,
                });
            wasDown = false;
        });
        // mouse move
        const updateProgress = (e, preset) => {
            if (!preset) {
                if (!holding) return;
                var preset = 100 - calcCurserPreset(e);
            }
            const mapper = gsap.utils.mapRange(0, 100, 0, -88);
            // move the progress line
            gsap.to(progressClip, { attr: { y: `${preset}%` } });
            // move the curser
            gsap.to(curser, { translateY: `${mapper(100 - preset) / 10}em` });
            // update displayed value
            let ayahIndex =
                    ((100 - parseInt(preset)) *
                        this.totalAyahs.ayahsList.length) /
                        100 -
                    1,
                formatText = Object.assign(
                    {},
                    this.totalAyahs.ayahsList[Math.max(0, ~~ayahIndex)]
                );
            formatText.ayah += 1;
            this.tooltipText = formatText;
        };
        updateProgress(null, parseInt(this.value));
        window.addEventListener("mousemove", updateProgress);
    },
    data() {
        return {
            tooltip: false,
            tooltipText: this.totalAyahs.current,
        };
    },
    computed: {
        ...mapState(["surah"]),
        value() {
            var current = this.totalAyahs.ayahsList[0]?.ayah || 0;
            this.totalAyahs.ayahsList.forEach((ayah, i) => {
                if (
                    ayah.surah == this.totalAyahs.current.surah &&
                    ayah.ayah == this.totalAyahs.current.ayah
                )
                    current = i;
            });
            let present =
                (current * 100) / (this.totalAyahs.ayahsList.length - 1);
            console.log(current, this.totalAyahs.ayahsList.length - 1, present);
            return `${100 - present}%`;
        },
    },
    methods: {
        ...mapActions(["updateGoalsHistory"]),
        formatPoint(point) {
            if (!point) return;
            const surah = this.surah.data.filter(
                (s) => s.englishName == point.surah
            )[0];
            return `${surah?.name} آيه ${point.ayah}`;
        },
    },
};
</script>
<style lang="sass">
.progress
    height: 100%
    position: absolute
    top: 0
    right: 5%
    path
        &#bar
            clip-path: url('#progressClip')
</style>
