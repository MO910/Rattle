<template lang="pug">
v-dialog(v-model='importExcel.dialog' persistent max-width='600px')
    v-card.py-6
        v-card-title import Excel
        v-card-text
            v-file-input(
                v-model="file"
                @change='getData'
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                label="File input"
            )
                template(v-slot:selection="{ text }")
                    v-chip(
                        small
                        label
                        color="primary"
                    ) {{ text }}
            
        v-card-text(v-if='importExcel.data')
            v-data-table(
                :loading='fetching'
                :headers="table.headers"
                :items="table.items"
            )
        v-card-actions
            v-spacer
            v-btn(color='red darken-1' text @click='close')
                | {{$vuetify.lang.t("$vuetify.cancel")}}
            v-btn(color='green darken-1' @click='getData') get data
                //- | {{$vuetify.lang.t("$vuetify.import")}}
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    // props: ["dialog"],
    head: { script: [{ src: "/js/read-excel-file.min.js" }] },
    data: () => ({
        fetching: false,
        file: null,
        table: {},
    }),
    computed: {
        ...mapState(["importExcel"]),
    },
    props: [],
    methods: {
        ...mapMutations(["updateModel"]),
        styleDataForTable() {
            if (!this.importExcel.data) return {};
            // headers
            let headers = this.importExcel.data[0];
            headers = headers.map((head) => ({ text: head, value: head }));
            // items
            let items = this.importExcel.data.slice(1);
            items = items.map((item) =>
                item.reduce((acc, curr, i) => {
                    acc[headers[i].text] = curr;
                    return acc;
                }, {})
            );
            this.table = { headers, items };
        },
        async getData() {
            let data;
            this.fetching = true;
            try {
                data = await readXlsxFile(this.file);
                this.updateModel(["importExcel.data", data]);
                this.styleDataForTable();
            } catch (err) {
                console.log(err);
            }
            this.fetching = false;
            // console.log(this.table);
        },
        close() {
            this.updateModel(["importExcel.data", null]);
            this.updateModel(["importExcel.dialog", false]);
            this.file = null;
        },
    },
};
</script>
