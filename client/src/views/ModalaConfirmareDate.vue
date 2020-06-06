<template>
  <v-card>
    <v-card-title>
      <span class="headline">Confirmare date</span>
    </v-card-title>
    <v-card-text
      v-if="!alertSuccess && !loading"
      class="body-1"
      style="height:450px;"
    >
      <v-row class="d-flex justify-center ml-2">
        Pentru a confirma pontajul, alegeți departamentul și luna pentru care
        doriți să confirmați datele
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
          label="Departament"
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
    </v-card-text>
    <v-card-text v-if="alertSuccess" class="body-1" style="height:300px;">
      <v-row class="d-flex justify-center" style="margin-top:120px">
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
    <v-card-text v-if="loading" class="body-1" style="height:300px;">
      <v-row class="d-flex justify-center" style="margin-top:120px">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="70"
        ></v-progress-circular>
      </v-row>
      <v-row class="d-flex justify-center">Se confirmă datele</v-row>
      <v-row class="d-flex justify-center">Vă rugăm așteptați</v-row>
    </v-card-text>
    <v-card-actions
      style="padding-right:24px;"
      v-if="!alertSuccess && !loading"
    >
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
          @click="confirma()"
          >CONFIRMĂ</v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import { ipServer } from "./ipServer";
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    angajat: Object
  },
  data() {
    return {
      departament: null,
      listaDepartamente: [],
      listaJudete: [],
      listaLocatii: [],
      menu: false,
      loading: false,
      judet: null,
      locatie: null,
      alertSuccess: false,
      date: new Date().toISOString().substr(0, 7)
    };
  },
    computed: {
    ...mapGetters(["getUser"])
  },
  methods: {
    toggleDialog() {
      this.$emit("toggleDialogConfirmare");
    },
    confirma() {
      this.loading = true;
      let dataC = this.date.split("-")[1] + "-" + this.date.split("-")[0];
      if (this.departament.NUME_DEPART !== "TOATE") {
        axios
          .post(
            `//${ipServer}:3000/api/confirmareLocatieDepart/${this.locatie.ID_N_LOCATIE}/${this.departament.ID_N_DEPART}/${dataC}`
          )
          .then(response => {
            if (response.status === 200) {
              this.loading = false;
              this.alertSuccess = true;
              setTimeout(() => {
                this.$emit("toggleDialogConfirmare");
                setTimeout(() => {
                  this.alertSuccess = false;
                }, 150);
              }, 1000);
            }
          });
      } else {
        axios
          .post(
            `//${ipServer}:3000/api/confirmareLocatie/${this.locatie.ID_N_LOCATIE}/${dataC}`
          )
          .then(response => {
            if (response.status === 200) {
              this.loading = false;
              this.alertSuccess = true;
              setTimeout(() => {
                this.$emit("toggleDialogConfirmare");
                setTimeout(() => {
                  this.alertSuccess = false;
                }, 150);
              }, 1000);
            }
          });
      }
    }
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
  },
  mounted() {
    axios.get(`//${ipServer}:3000/api/judete`).then(response => {
      console.log(this.getUser.data);
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
    });
  }
};
</script>

<style lang="scss" scoped></style>
