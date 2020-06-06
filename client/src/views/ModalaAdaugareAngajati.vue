<template>
  <v-card>
    <v-card-title>
      <span class="headline">Adăugare angajat</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form" class="form" v-model="valid" lazy-validation>
          <v-alert type="error" v-if="showFailedAlert">
            <span>Adăugare eșuată</span>
          </v-alert>
          <v-row>
            <v-col cols="3" class="d-flex align-center pl-3">Nume:</v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-text-field :rules="campObligatoriu" v-model="nume" outlined style="height:60px;"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="d-flex align-center">Prenume:</v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-text-field
                :rules="campObligatoriu"
                v-model="prenume"
                outlined
                style="height:60px;"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="d-flex align-center pl-3">CNP:</v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-text-field :rules="campObligatoriu" v-model="cnp" outlined style="height:60px;"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3" class="d-flex align-center pl-3">Marca:</v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-text-field :rules="campObligatoriu" v-model="marca" outlined style="height:60px;"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions style="padding-right:24px;">
      <v-col offset="4" cols="4" class="d-flex pr-0" style="height:60px;padding-left:24px;">
        <v-btn
          class="error d-flex justify-center"
          style="width:100% !important;"
          @click="toggleDialog"
        >ANULARE</v-btn>
      </v-col>
      <v-col cols="4" class="d-flex">
        <v-btn
          class="success d-flex justify-center"
          style="width:100% !important;"
          @click="createAngajat"
        >SALVEAZA</v-btn>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import {ipServer} from "./ipServer";


export default {
  components: {},
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
      this.$refs.form.reset();
      this.$emit("toggleDialog");
    },
    createAngajat() {
      if (this.$refs.form.validate()) {
        let angajat = {
          nume: this.nume,
          prenume: this.prenume,
          cnp: this.cnp,
          marca: this.marca
        };
        axios
          .post(`//${ipServer}:3000/api/angajati`, angajat)
          .then(() => {
              this.$emit("refreshAngajati");
              this.toggleDialog();
            
          })
          .catch(() => {
              this.showFailedAlert = true;
          });
      }
    }
  }
};
</script>

<style lang = "scss" scoped>
</style>
