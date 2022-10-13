<template lang="pug" key="index">
v-edit-dialog(
    :return-value.sync='props.item[col]'
    @save="updateUserField(props)"
) {{ props.item[col] }}
    template(v-slot:input)
        v-text-field(
            v-model='props.item[col]'
            label='Edit'
            single-line
        )
</template>
<script>
import { mapActions } from "vuex";
export default {
    props: ["props", "col"],
    data: () => ({}),
    mounted() {},
    computed: {},
    methods: {
        ...mapActions(["updateUser"]),
        updateUserField(props) {
            this.updateUser({
                id: props.item.id,
                [props.header.value]: props.value,
            });
        },
    },
};
</script>
<style lang="sass">
td
    white-space: break-spaces
</style>
