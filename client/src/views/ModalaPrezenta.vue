<template>
  <v-card>
    <v-card-title>
      <span class="headline">Generare foaie prezență</span>
    </v-card-title>
    <v-card-text v-if="!alertSuccess" class="body-1">
      <v-row class="d-flex justify-center ml-2">
        Pentru a genera o foaie de prezență, alegeți departamentul, luna și
        perioada pentru care doriți să o generați
      </v-row>
      <v-row class="mt-4 ml-2"> Județ: </v-row>
      <v-row class="d-flex justify-center ml-2" style="width:430px;">
        <v-select
          v-model="judet"
          dense
          :items="listaJudete"
          item-text="JUDET"
          return-object
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-row>
      <v-row class="mt-4 ml-2"> Locație: </v-row>
      <v-row class="d-flex justify-center ml-2" style="width:430px;">
        <v-select
          v-model="locatie"
          dense
          :items="listaLocatii"
          item-text="LOCATIA"
          return-object
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-row>
      <v-row class="mt-4 ml-2"> Departament: </v-row>
      <v-row class="d-flex justify-center ml-2" style="width:430px;">
        <v-select
          v-model="departament"
          dense
          :items="listaDepartamente"
          item-text="NUME_DEPART"
          return-object
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-row>
      <v-row class="mt-4 ml-2"> Luna: </v-row>
      <v-row class="ml-2" style="width:430px;">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field v-model="date" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            type="month"
            locale="ro"
            no-title
            scrollable
            @input="menu = false"
          >
          </v-date-picker>
        </v-menu>
      </v-row>
      <v-row class="mt-4 ml-2"> Perioada: </v-row>
      <v-row class="d-flex justify-center ml-2" style="width:430px;">
        <v-select
          v-model="perioada"
          dense
          item-text="text"
          return-object
          :items="perioade"
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-row>
    </v-card-text>
    <v-card-text v-else class="body-1">
      <v-row class="d-flex justify-center">
        <i
          class="fa fa-calendar-check-o"
          aria-hidden="true"
          style="font-size:50px; color:green"
        ></i>
      </v-row>
      <v-row class="d-flex justify-center mt-4" style="color:green"
        >Datele au fost confirmate cu succes</v-row
      >
    </v-card-text>
    <v-card-actions style="padding-right:24px;" v-if="!alertSuccess">
      <v-col
        offset="4"
        cols="4"
        class="d-flex pr-0"
        style="height:60px;padding-left:24px;"
      >
        <v-btn
          class="error d-flex justify-center"
          style="width:100% !important;"
          @click="toggleDialog"
          >ANULARE</v-btn
        >
      </v-col>
      <v-col cols="4" class="d-flex">
        <v-btn
          class="success d-flex justify-center"
          style="width:100% !important;"
          @click="genereaza()"
          >GENEREAZĂ</v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import { ipServer } from "./ipServer";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
export default {
  components: {},
  props: {
    angajat: Object
  },
  data() {
    return {
      departament: null,
      judet: null,
      locatie: null,
      perioada: { text: "Săptămânile 1-2", value: "1" },
      listaDepartamente: [],
      listaJudete: [],
      listaLocatii: [],
      perioade: [
        { text: "Săptămânile 1-2", value: "1" },
        { text: "Întreaga lună", value: "2" }
      ],
      menu: false,

      alertSuccess: false,
      date: new Date().toISOString().substr(0, 7)
    };
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  methods: {
    toggleDialog() {
      this.$emit("toggleDialogPrezenta");
    },
    toggleDialogCuGenerare() {
      this.$emit("toggleDialogPrezenta");
      this.$emit("showGenerationAlert");
    },
    genereaza() {
      let optiuni = {
        id_dep: this.departament.ID_N_DEPART,
        id_loc: this.locatie.ID_N_LOCATIE,
        titlu:
          this.departament.NUME_DEPART.toUpperCase() +
          " " +
          this.locatie.LOCATIA.toUpperCase(),
        date: this.date
          .split("-")
          .reverse()
          .join("-"),
        jumatate: this.perioada.value,
        userCurent: this.getUser.data.id
      };
      this.toggleDialogCuGenerare();
      if (this.departament.NUME_DEPART !== "TOATE") {
        return axios
          .post(`//${ipServer}:3000/api/create-pdf-locatie-dep`, optiuni)
          .then(() => {
            axios
              .get(`//${ipServer}:3000/api/fetch-pdf`, { responseType: "blob" })
              .then(res => {
                const pdfBlob = new Blob([res.data], {
                  type: "application/pdf"
                });
                saveAs(pdfBlob, `FoaiePrezenta${optiuni.date}.pdf`);
                this.$emit("showDoneAlert");
              });
          });
      } else {
        let optiuni = {
          id_loc: this.locatie.ID_N_LOCATIE,
          titlu: this.locatie.LOCATIA.toUpperCase(),
          date: this.date
            .split("-")
            .reverse()
            .join("-"),
          jumatate: this.perioada.value,
          userCurent: this.getUser.data.id
        };
        return axios
          .post(`//${ipServer}:3000/api/create-pdf-locatie`, optiuni)
          .then(() => {
            axios
              .get(`//${ipServer}:3000/api/fetch-pdf`, { responseType: "blob" })
              .then(res => {
                const pdfBlob = new Blob([res.data], {
                  type: "application/pdf"
                });
                saveAs(pdfBlob, `FoaiePrezenta${optiuni.date}.pdf`);
                this.$emit("showDoneAlert");
              });
          });
      }
    }
  },
  mounted() {
    axios.get(`//${ipServer}:3000/api/judete`).then(response => {
      if (this.getUser.data.idAngajat !== 99999) {
        this.listaJudete = response.data.filter(
          item => item.ID_N_JUDET === this.getUser.data.judet
        );
      } else {
        this.listaJudete = response.data;
      }
      this.judet = this.listaJudete[0];
    });
    axios.get(`//${ipServer}:3000/api/departamente`).then(response => {
      this.listaDepartamente = response.data;
      this.departament = this.listaDepartamente[0];
      (
        this.date
          .split("-")
          .reverse()
          .join("-")
      );
    });
  },
  watch: {
    judet() {
      axios
        .get(`//${ipServer}:3000/api/judete/${this.judet.ID_N_JUDET}`)
        .then(response => {
          this.listaLocatii = response.data;
          this.locatie = this.listaLocatii[0];
        });
    },
    locatie() {
      axios
        .get(
          `//${ipServer}:3000/api/departamenteDinLoc/${this.locatie.ID_N_LOCATIE}`
        )
        .then(response => {
          this.listaDepartamente = [];
          this.listaDepartamente.push({ NUME_DEPART: "TOATE" });
          this.listaDepartamente.push(...response.data);
          this.departament = this.listaDepartamente[0];
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
