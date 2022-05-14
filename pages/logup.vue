<template lang="pug">
v-container
    h2 creating organization
    v-stepper(v-model='e6' non-linear)
        v-stepper-header
            template(v-for='step, i in steps')
                v-stepper-step.text-capitalize(:complete='e6 > i + 1' :step='i + 1' editable)
                    | {{step}}
                v-divider(v-if='i !== steps.length - 1')
        v-stepper-items
            v-stepper-content(step='1')
                v-text-field(
                    name="email"
                    autocomplete="username"
                    label="username"
                )
                v-btn(color='primary' @click='e6 = 2') Continue
                v-btn(text) Cancel
            v-stepper-content(step='2')
                v-card.mb-12(color='grey lighten-1' height='200px')
                v-btn(color='primary' @click='e6 = 3') Continue
                v-btn(text) Cancel
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    data: () => ({
        e6: 1,
        steps: ["owner information", "organization information"],
    }),
};
</script>
