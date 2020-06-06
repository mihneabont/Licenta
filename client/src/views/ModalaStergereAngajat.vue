<template>
  <v-card>
    <v-card-title>
      <span class="headline">Ștergere angajat</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row style="font-size:16px;">Sunteți sigur că doriți să ștergeți angajatul {{angajat.NUME}} {{angajat.PRENUME}} ({{angajat.MARCA}})?</v-row>
      </v-container>
    </v-card-text>
    <v-card-actions style="padding-right:24px;">
      <v-col offset="4" cols="4" class="d-flex pr-0" style="height:60px;padding-left:24px;">
        <v-btn
          class="primary d-flex justify-center"
          style="width:100% !important;"
          @click="toggleDialog"
        >ANULARE</v-btn>
      </v-col>
      <v-col cols="4" class="d-flex">
        <v-btn
          class="error d-flex justify-center"
          style="width:100% !important;"
          @click="stergeAngajat"
        >STERGE</v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import {ipServer} from "./ipServer";

export default {
  components: {},
  props: {
    angajat: Object
  },
  data() {
    return {
      nume: null,
      prenume: null,
      cnp: null,
      marca: null,
      showFailedAlert: false,
      campObligatoriu: [v => !!v || "Câmp obligatoriu"]
    };
  },
  methods: {
    toggleDialog() {
      this.$emit("toggleDialogStergere");
    },
    stergeAngajat() {
      axios
        .delete(`//${ipServer}:3000/api/angajati/${this.angajat.ID_SALARIAT}`)
        .then(response => {
          if (response.status === 200) {
            this.$emit("refreshAngajati");
            this.toggleDialog();
          }
        })
        .catch(() => {
          this.showFailedAlert = true;
        });
    }
  }
};
</script>

<style lang = "scss" scoped>
</style>
