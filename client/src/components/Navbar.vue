<template>
  <nav>
    <v-app-bar flat app>
      <v-btn
        v-if="!isHomeOrAuth"
        class="primary darken-1 account-button-size mr-5"
        @click="$router.push('/')"
      >
        <i class="fa fa-arrow-left" aria-hidden="true"></i>ÎNAPOI
      </v-btn>
      <v-toolbar-title class="text-uppercase grey--text">
        <span style="font-size:30px;">EMP MANAGER</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom v-if="isHome">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn class="d-flex primary mr-2" @click="getGhid"
              ><i class="fa fa-book fa-2x" aria-hidden="true"
            /></v-btn>
          </div>
        </template>
        <span>Ghid utilizare</span>
      </v-tooltip>
      <v-tooltip bottom v-if="isHome">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn class="d-flex primary mr-2" @click="dialogParola = true"
              ><i class="fa fa-user fa-2x" aria-hidden="true"
            /></v-btn>
          </div>
        </template>
        <span>Schimbare parolă</span>
      </v-tooltip>
      <v-tooltip bottom v-if="isCalendar && isSuperAdmin">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn class="d-flex primary mr-2" @click="dialogSarbatori = true"
              ><i class="fa fa-asterisk  fa-2x" aria-hidden="true"
            /></v-btn>
          </div>
        </template>
        <span>Zile libere</span>
      </v-tooltip>
    </v-app-bar>
    <v-dialog v-model="dialogParola" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Schimbare parolă</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert type="error" v-if="showAlertWrongPassword">
              <span>Parola actuală nu este corectă!</span>
            </v-alert>
            <v-row class="d-flex justify-center body-1">
              Pentru a vă schimba parola introduceți parola actuală și parola
              nouă. Câmpul confirmare parolă nouă trebuie să conțină tot parola
              nouă.
            </v-row>
            <v-form ref="form" class="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    required
                    ref="password"
                    :rules="obligatoryRules"
                    type="password"
                    name="input-10-1"
                    class="mb-4"
                    label="Parola actuală"
                  ></v-text-field>
                  <v-text-field
                    v-model="password2"
                    required
                    ref="password2"
                    :rules="passwordRules"
                    type="password"
                    name="input-10-1"
                    class="mb-4"
                    label="Parola nouă"
                  ></v-text-field>
                  <v-text-field
                    v-model="passwordConf"
                    required
                    ref="password2"
                    :rules="passwordConfRules"
                    type="password"
                    name="input-10-1"
                    class="mb-4"
                    label="Confirmare parolă nouă"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-col
            offset="6"
            cols="3"
            class="d-flex pr-0"
            style="height:60px;padding-left:24px;"
          >
            <v-btn
              class="error d-flex justify-center"
              style="width:100% !important;"
              @click="toggleDialogParola"
              >ANULARE</v-btn
            >
          </v-col>
          <v-col cols="3" class="d-flex">
            <v-btn
              class="success d-flex justify-center"
              style="width:100% !important;"
              @click="salveaza"
              >SCHIMBĂ</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSarbatori" persistent max-width="700px" scrollable>
      <v-card style="height:600px;">
        <v-card-title>
          <span class="headline">Zile libere</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="d-flex justify-center body-1">
              Puteți introduce zile libere. Aceste zile vor fi blocate in
              calendar si nu vor fi luate in considerare pentru ore.
            </v-row>
            <v-form ref="form" class="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="3" class="d-flex align-center"
                  >Dată sărbătoare:</v-col
                >
                <v-col cols="6">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dataSarbatoare"
                        readonly
                        outlined
                        style="height:40px;"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      show-current
                      locale="ro"
                      v-model="dataSarbatoare"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="3" class="d-flex align-center"
                  ><v-btn
                    class="success d-flex justify-center"
                    style="width:100% !important;"
                    @click="postSarbatoare()"
                    >ADAUGĂ</v-btn
                  ></v-col
                >
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex align-center">
                  <v-data-table
                    :headers="headers"
                    :items="dateSarbatori"
                    v-if="j"
                    :items-per-page="5"
                    :hide-default-footer="true"
                    disable-pagination
                    class="elevation-1"
                    style=" width:100%"
                  ></v-data-table> </v-col
              ></v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-col offset="9" cols="3" class="d-flex" style="height:60px;">
            <v-btn
              class="primary d-flex justify-center"
              style="width:100% !important;"
              @click="toggleDialogSarbatori"
              >OK</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
import { ipServer } from "../views/ipServer";
import { saveAs } from "file-saver";
const axios = require("axios");
export default {
  data() {
    return {
      dialogParola: false,
      password: "",
      password2: "",
      passwordConf: "",
      showAlertWrongPassword: false,
      dialogSarbatori: false,
      dateSarbatori: [],
      valid: null,
      j: true,
      menu2: false,
      dataSarbatoare: null,
      headers: [{ text: "Zile libere", value: "DATA", sortable:false }],
      passwordRules: [
        (v) => !!v || "Camp obligatoriu!",
        (v) =>
          /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^(.{8,15})$/.test(v) ||
          "Lungime 8-15 caractere, cel puțin o literă si un număr",
      ],
      passwordConfRules: [
        (v) => !!v || "Camp obligatoriu!",
        (v) => v === this.password2 || "Nu este la fel ca parola nouă",
      ],
      obligatoryRules: [(v) => !!v || "Camp obligatoriu!"],
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    isHome() {
      return this.$route.path === "/";
    },
    isCalendar() {
      return this.$route.path === "/calendar";
    },
    isHomeOrAuth() {
      return this.$route.path === "/" || this.$route.path === "/autentificare";
    },
    isSuperAdmin() {
      return this.getUser.data.admin && this.getUser.data.idAngajat === 99999;
    },
  },
  methods: {
    toggleDialogParola() {
      this.password = "";
      this.password2 = "";
      this.passwordConf = "";
      this.showAlertWrongPassword = false;
      this.$refs.form.reset();
      this.dialogParola = false;
    },
    toggleDialogSarbatori() {
      this.dialogSarbatori = false;
    },
    getGhid() {
      axios
        .get(`//${ipServer}:3000/api/ghid`, { responseType: "blob" })
        .then((res) => {
          const pdfBlob = new Blob([res.data], {
            type: "application/pdf",
          });
          saveAs(pdfBlob, `Ghid.pdf`);
          this.$emit("showDoneAlert");
        });
    },
    getSarbatori() {
            this.j=false;
      axios.get(`//${ipServer}:3000/api/sarbatori`).then((res) => {
        res.data.forEach((element, index) => {
          this.dateSarbatori[index] = { DATA: this.formatDate(element.DATA.substring(0,10)) };
                this.j=true;
        });
      });
    },
    postSarbatoare() {
      let payload = {
        date: this.dataSarbatoare
      }
      axios.post(`//${ipServer}:3000/api/sarbatori`, payload).then(() => {
        this.dataSarbatoare = null;
        this.getSarbatori();
      })
    },
    formatDate(input) {
      var datePart = input.match(/\d+/g),
        year = datePart[0],
        month = datePart[1],
        day = datePart[2];

      return day + "/" + month + "/" + year;
    },
    salveaza() {
      if (this.$refs.form.validate()) {
        let payload = {
          idUtilizator: this.getUser.data.id,
          parolaActuala: this.password,
          parolaNoua: this.passwordConf,
        };
        axios
          .post(`//${ipServer}:3000/api/schimbaParola`, payload)
          .then((response) => {
            if (response.data == `Update reusit.`) {
              this.toggleDialogParola();
              this.$router.push("/autentificare");
              this.$store.commit("LOGOUT");
            }
          })
          .catch(() => {
            this.showAlertWrongPassword = true;
          });
      }
    },
  },
  mounted() {
    this.getSarbatori();
  },
};
</script>

<style scoped>
.stick-left {
  left: 0px !important;
}
</style>
