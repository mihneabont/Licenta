<template>
  <v-container fluid fill-height>
    <v-col cols="12" style="height:100%">
      <v-row>
        <v-col offset="8" cols="2" class="d-flex align-center">
          <text-reader
            v-if="!showLoading && !showSuccess && !showError"
            @load="text = $event"
          ></text-reader>
        </v-col>
      </v-row>
      <v-container v-if="showLoading" style="height:30vh;margin-top:30vh;">
        <v-row class="d-flex justify-center">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="70"
          ></v-progress-circular>
        </v-row>
        <v-row class="d-flex justify-center">Se adaugă datele din fișier</v-row>
        <v-row class="d-flex justify-center"
          >În funcție de numărul de date noi, timpul de adăugare variază de la
          secunde până la câteva minute
        </v-row>
        <v-row class="d-flex justify-center">Vă rugăm așteptați</v-row>
      </v-container>
      <v-container v-if="showSuccess" style="height:30vh;margin-top:30vh;">
        <v-row class="d-flex justify-center">
          <i
            class="fa fa-calendar-check-o"
            aria-hidden="true"
            style="font-size:50px; color:green"
          ></i>
        </v-row>
        <v-row class="d-flex justify-center mt-4" style="color:green"
          >Datele au fost adăugate cu succes</v-row
        >
      </v-container>
      <v-container v-if="showError" style="height:30vh;margin-top:30vh;">
        <v-row class="d-flex justify-center">
          <i
            class="fa fa-times"
            aria-hidden="true"
            style="font-size:50px; color:red"
          ></i>
        </v-row>
        <v-row class="d-flex justify-center mt-4" style="color:red"
          >Eroare la adăugare</v-row
        >
      </v-container>
      <v-container v-if="!showLoading && !showSuccess && !showError">
        <v-row class="d-flex justify-center">
          <v-col cols="8">
            <v-data-table
              :footer-props="footer_props"
              :headers="headers"
              :items="tableItems"
              :items-per-page="10"
              class="elevation-1 w-100"
            >
              <template slot="no-data">
                Selectați un fișier cu date de pontaj
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" offset="8" class="d-flex">
            <v-row>
              <v-col cols="7" offset="5" class="d-flex">
                <v-btn
                  class="success d-flex justify-center"
                  style="width:100% !important;"
                  v-if="tableItems.length > 0"
                  @click="salveazaDate()"
                  >SALVEAZĂ</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-container>
</template>

<script>
import TextReader from "../components/TextReader";
import axios from "axios";
import {ipServer} from "./ipServer";

export default {
  name: "app",
  data() {
    return {
      headers: [
        {
          text: "ID_CEAS",
          value: "ID_CEAS"
        },

        { text: "COD_CARTELA", value: "COD_CARTELA" },
        { text: "DATA_PONTARE", value: "DATA_PONTARE" },
        { text: "ORA_PONTARE", value: "ORA_PONTARE" },
        { text: "TIP_PONTARE", value: "TIP_PONTARE" }
      ],
      footer_props: {
        "items-per-page-options": [],
        "items-per-page-text": "",
        "disable-items-per-page": true
      },
      items: [],
      showLoading: false,
      showSuccess: false,
      showError: false,
      tableItems: [],
      text: null
    };
  },
  components: {
    TextReader
  },
  methods: {
    salveazaDate() {
      this.showLoading = true;
      axios
        .post(`//${ipServer}:3000/api/upload`, this.tableItems)
        .then(response => {
          this.showLoading = false;
          if (response.status === 200) {
            this.showSuccess = true;
          } else {
            this.showError = true;
          }
          console.log(response);
        });
    }
  },
  watch: {
    text() {
      this.tableItems = [];
      this.items = this.text.split(/\r?\n/);
      this.items.forEach(element => {
        let elementPieces = element.split("\t");
        if (elementPieces.length === 5) {
          this.tableItems.push({
            ID_CEAS: elementPieces[0],
            COD_CARTELA: elementPieces[1],
            DATA_PONTARE: elementPieces[2],
            ORA_PONTARE: elementPieces[3],
            TIP_PONTARE: elementPieces[4].substring(0, 2)
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.v-data-footer {
  height: 48px;
}
.v-data-footer__select {
  display: none !important;
}
</style>
