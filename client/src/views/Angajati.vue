<template>
  <v-container fluid fill-height>
    <v-col cols="3" style="height:100%">
      <v-row class="d-flex justify-center">
        <v-dialog v-model="dialog" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="success ml-3" style="width:200px;">
              <i class="fa fa-plus mr-2" aria-hidden="true"></i>
              <span>ADAUGĂ ANGAJAT</span>
            </v-btn>
          </template>
          <modala-adaugare-angajat
            @toggleDialog="toggleDialog"
            @refreshAngajati="refreshAngajati"
          ></modala-adaugare-angajat>
        </v-dialog>
      </v-row>
      <v-row class="d-flex mt-2 justify-center">
        <v-dialog v-model="dialogStergere" persistent max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              class="error ml-3"
              style="width:200px;"
              :disabled="!selectedUser"
            >
              <i class="fa fa-trash mr-2" aria-hidden="true"></i>
              <span>ȘTERGE ANGAJAT</span>
            </v-btn>
          </template>
          <modala-stergere-angajat
            :angajat="selectedUser"
            @toggleDialogStergere="toggleDialogStergere"
            @refreshAngajati="refreshAngajati"
          ></modala-stergere-angajat>
        </v-dialog>
      </v-row>
      <v-list>
        <v-text-field
          outlined
          label="Căutare"
          prepend-inner-icon="fa-search"
          style="height:60px;"
          v-model="search"
        ></v-text-field>
        <v-list-item-group
          v-model="selectedUser"
          color="primary"
          mandatory
          style="max-height:65vh"
          class="overflow-y-auto"
        >
          <v-list-item
            v-for="(angajat, i) in listaAngajatiFilitrata"
            :key="i"
            :value="angajat"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex">
                <span>{{ angajat.NUME }} {{ angajat.PRENUME }}</span>
                <span class="ml-auto">{{ angajat.MARCA }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="9" style="height:88vh" v-if="userLoading">
      <v-row
        style="height:88vh"
        class="pr-3 pt-1 d-flex justify-center align-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="70"
        ></v-progress-circular></v-row
    ></v-col>
    <v-col cols="9" style="height:88vh" v-else>
      <v-row style="height:30%;">
        <v-col cols="12" class="pt-0">
          <v-row class="pt-0" style="height:20%;">
            <v-col cols="7">
              <span class="headline pb-2">Date personale</span>
            </v-col>
            <v-col offset="1" cols="1" class="d-flex">
              <v-btn
                class="primary d-flex justify-center ml-auto"
                style="min-width:10px !important;"
                v-if="editVisible"
                @click="toggleEditVisible"
              >
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </v-btn>
            </v-col>
          </v-row>
          <div style="height:70%">
            <v-row style="height:50%">
              <v-col cols="1" class="d-flex align-center pl-3">Nume:</v-col>
              <v-col cols="3" class="d-flex align-center">
                <v-text-field
                  v-model="nume"
                  :disabled="editVisible"
                  outlined
                  style="height:50px;"
                ></v-text-field>
              </v-col>
              <v-col offset="1" cols="1" class="d-flex align-center"
                >Prenume:</v-col
              >
              <v-col cols="3" class="d-flex align-center">
                <v-text-field
                  v-model="prenume"
                  :disabled="editVisible"
                  outlined
                  style="height:50px;"
                ></v-text-field>
              </v-col>
              <v-col
                cols="2"
                class=" ml-10 d-flex align-center justify-center"
                style="border:2px dashed; border-bottom:0px !important; border-color:#3B4B8D"
              >
                <span class="mt-auto title" style="color:#3B4B8D"
                  >Începând cu data:</span
                >
              </v-col>
            </v-row>
            <v-row style="height:50%">
              <v-col cols="1" class="d-flex align-center">Marca:</v-col>
              <v-col cols="3" class="d-flex align-center">
                <v-text-field
                  v-model="marca"
                  :disabled="editVisible"
                  outlined
                  style="height:50px;"
                ></v-text-field>
              </v-col>
              <v-col offset="1" cols="1" class="d-flex align-center"
                >CNP:</v-col
              >
              <v-col cols="3" class="d-flex align-center">
                <v-text-field
                  v-model="cnp"
                  :disabled="editVisible"
                  outlined
                  style="height:50px;"
                ></v-text-field>
                
              </v-col>
              <v-col
                cols="2"
                class=" ml-10 d-flex align-center justify-center"
                style="border:2px dashed; border-top:0px !important; border-color:#3B4B8D"
              >
                <span class="mb-auto title" style="color:#3B4B8D">{{
                  dataInceput
                }}</span>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row style="height:30%;">
        <v-col cols="12" class="pt-0">
          <v-row class="pl-2 pt-0" style="height:20%;">
            <span class="headline pb-2 pl-1 mt-3">Locul de muncă</span>
          </v-row>
          <div style="height:70%">
            <v-row style="height:50%">
              <v-col cols="1" class="d-flex align-center">Judet:</v-col>
              <v-col cols="3" class="d-flex align-center">
                <v-select
                  v-model="judet"
                  outlined
                  :items="listaJudete"
                  :disabled="editVisible"
                  return-object
                  item-text="JUDET"
                  menu-props="auto"
                  hide-details
                  single-line
                ></v-select>
              </v-col>
              <v-col offset="1" cols="1" class="d-flex align-center"
                >Locatie:</v-col
              >
              <v-col cols="3" class="d-flex align-center">
                <v-select
                  v-model="locatie"
                  outlined
                  :disabled="editVisible"
                  :items="listaLocatii"
                  item-text="LOCATIA"
                  return-object
                  menu-props="auto"
                  hide-details
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row style="height:50%">
              <v-col cols="1" class="d-flex align-center">
                <div>
                  <span v-if="isSmallWindow">Dep:</span>
                  <span v-else>Departament:</span>
                </div>
              </v-col>
              <v-col cols="3" class="d-flex align-center">
                <v-select
                  v-model="departament"
                  outlined
                  :disabled="editVisible"
                  :items="listaDepartamente"
                  item-text="NUME_DEPART"
                  return-object
                  menu-props="auto"
                  hide-details
                  single-line
                ></v-select>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row style="height:20%;">
        <v-col cols="12" class="pt-0">
          <v-row class="pl-2 pt-0" style="height:30%;">
            <span class="headline pb-2 mt-3 mb-4">Dată angajare/plecare</span>
          </v-row>
          <div style="height:70%" class="d-flex align-center">
            <v-row style="height:80%">
              <v-col cols="1" class="d-flex align-center pl-3">Angajare:</v-col>
              <v-col cols="3" class="d-flex">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :disabled="editVisible"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dateFormattedAngajare"
                      readonly
                      :disabled="editVisible"
                      outlined
                      style="height:40px;"
                      @blur="dataAngajare = parseDate(dateFormattedAnagajre)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    show-current
                    locale="ro"
                    v-model="dataAngajare"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col offset="1" cols="1" class="d-flex align-center"
                >Plecare:</v-col
              >
              <v-col cols="3" class="d-flex">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  :disabled="editVisible"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dateFormattedPlecare"
                      :disabled="editVisible"
                      readonly
                      clearable
                      outlined
                      style="height:40px;"
                      @blur="dataPlecare = parseDate(dateFormattedPlecare)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    show-current
                    locale="ro"
                    v-model="dataPlecare"
                    @input="menu1 = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-row style="height:10%">
        <v-col cols="12" class="pt-0">
          <v-row class="pl-2 pt-0 mb-4" style="height:20%;">
            <span class="headline pl-1">Cod cartelă pontaj</span>
          </v-row>
          <div style="height:80%">
            <v-row style="height:80%">
              <v-col cols="4" class="d-flex align-center" style="height:60px;">
                <v-text-field
                  v-model="codCartela"
                  :disabled="editVisible"
                  class="mb-auto"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col offset="1" cols="4" class="d-flex" style="height:60px;">
                <v-col
                  offset="4"
                  cols="4"
                  class="d-flex pr-0"
                  style="height:60px;"
                >
                  <v-btn
                    class="error d-flex justify-center ml-auto"
                    style="width:100% !important;"
                    v-if="!editVisible"
                    @click="toggleEditVisible"
                    >ANULARE</v-btn
                  >
                </v-col>
                <v-col cols="4" class="d-flex pr-0">
                  <v-btn
                    class="success d-flex justify-center ml-auto"
                    style="width:100% !important;"
                    v-if="!editVisible"
                    @click="saveData"
                    >SALVEAZA</v-btn
                  >
                </v-col>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import ModalaAdaugareAngajat from "./ModalaAdaugareAngajati";
import ModalaStergereAngajat from "./ModalaStergereAngajat";
import axios from "axios";
import { ipServer } from "./ipServer";
export default {
  components: {
    ModalaAdaugareAngajat,
    ModalaStergereAngajat
  },
  data: vm => ({
    item: 1,
    dialog: false,
    dialogStergere: false,
    userLoading: false,
    editVisible: true,
    windowWidth: null,
    items: [],
    selectedUser: null,
    copieDate: {},
    nume: null,
    prenume: null,
    cnp: null,
    marca: null,
    search: "",
    date: null,
    dataInceput: new Date().toISOString().substr(0, 10),
    menu1: false,
    menu2: false,
    judet: null,
    locatie: null,
    departament: null,
    dataAngajare: new Date().toISOString().substr(0, 10),
    dateFormattedAngajare: vm.formatDate(
      new Date().toISOString().substr(0, 10)
    ),
    dateFormattedPlecare: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dataPlecare: new Date().toISOString().substr(0, 10),
    codCartela: null,
    listaDepartamente: [],
    listaJudete: [],
    listaLocatii: [],
    angajati: []
  }),
  computed: {
    isSmallWindow() {
      return this.windowWidth < 1650;
    },
    listaAngajatiFilitrata() {
      var lowSearch = this.search.toLowerCase();
      console.log(this.angajati);
      let keys = ["NUME", "PRENUME", "MARCA", "COMPLET"];
      return this.angajati.filter(function(angajat) {
        angajat.COMPLET = angajat.NUME + " " + angajat.PRENUME;
        return keys.some(key =>
          String(angajat[key])
            .toLowerCase()
            .startsWith(lowSearch)
        );
      });
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    formatareDataBD(data) {
      if (data) {
        const months = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        ];
        let current_datetime = data.toString().split("-");
        console.log(current_datetime);
        return (
          current_datetime[2] +
          "-" +
          months[current_datetime[1] - 1] +
          "-" +
          current_datetime[0]
        );
      }
      return null;
    },
    formatareDataDinBD(dataBD) {
      if (dataBD) {
        let current_datetime = dataBD.toString().split("-");
        return (
          current_datetime[0] +
          "-" +
          current_datetime[1] +
          "-" +
          current_datetime[2]
        );
      }
      return null;
    },
    toggleDialog() {
      this.dialog = !this.dialog;
    },
    toggleDialogStergere() {
      this.dialogStergere = !this.dialogStergere;
    },
    saveData() {
      let payload = {
        id_angajat: this.selectedUser.ID_SALARIAT,
        nume: this.nume,
        prenume: this.prenume,
        marca: this.marca,
        cnp: this.cnp,
        data_inceput: this.formatareDataBD(this.dataAngajare),
        data_sfarsit: this.formatareDataBD(this.dataPlecare),
        judet: this.judet.ID_N_JUDET,
        locatia: this.locatie.ID_N_LOCATIE,
        departament: this.departament.ID_N_DEPART,
        cod_cartela: this.codCartela
      };
      return axios.put(`//${ipServer}:3000/api/angajati/`, payload).then(() => {
        this.editVisible = !this.editVisible;
      });
    },
    toggleEditVisible() {
      if (!this.editVisible) {
        this.nume = this.copieDate.nume;
        this.prenume = this.copieDate.prenume;
        this.cnp = this.copieDate.cnp;
        this.marca = this.copieDate.marca;
        this.judet = this.copieDate.judet;
        this.locatie = this.copieDate.locatie;
        this.departament = this.copieDate.departament;
        this.dataAngajare = this.copieDate.dataAngajare;
        this.dataPlecare = this.copieDate.dataPlecare;
        this.codCartela = this.copieDate.codCartela;
      }
      if (this.editVisible) {
        this.copieDate.nume = this.nume;
        this.copieDate.prenume = this.prenume;
        this.copieDate.cnp = this.cnp;
        this.copieDate.marca = this.marca;
        this.copieDate.judet = this.judet;
        this.copieDate.locatie = this.locatie;
        this.copieDate.departament = this.departament;
        this.copieDate.dataAngajare = this.dataAngajare;
        this.copieDate.dataPlecare = this.dataPlecare;
        this.copieDate.codCartela = this.codCartela;
      }
      this.editVisible = !this.editVisible;
    },
    toggleEditVisibleUserChange() {
      if (!this.editVisible) {
        this.editVisible = !this.editVisible;
      }
    },
    refreshAngajati() {
      this.userLoading = true;
      axios.get(`//${ipServer}:3000/api/angajati`).then(response => {
        this.userLoading = false;
        this.angajati = response.data;
        this.selectedUser = this.angajati[0];
      });
    }
  },
  mounted() {
    this.refreshAngajati();
    axios.get(`//${ipServer}:3000/api/judete`).then(response => {
      this.listaJudete = response.data;
    });
    axios.get(`//${ipServer}:3000/api/departamente`).then(response => {
      this.listaDepartamente = response.data;
    });
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  watch: {
    selectedUser() {
      this.toggleEditVisibleUserChange();
      this.userLoading = true;
      axios
        .get(`//${ipServer}:3000/api/angajati/${this.selectedUser.ID_SALARIAT}`)
        .then(response => {
          this.nume = response.data[0].NUME;
          this.prenume = response.data[0].PRENUME;
          this.cnp = response.data[0].CNP;
          this.marca = response.data[0].MARCA;
          this.judet = {
            ID_N_JUDET: response.data[0].ID_N_JUDET,
            JUDET: response.data[0].JUDET
          };
          this.locatie = {
            ID_N_LOCATIE: response.data[0].ID_N_LOCATIE,
            LOCATIA: response.data[0].LOCATIA
          };
          this.departament = {
            ID_N_DEPART: response.data[0].ID_N_DEPART,
            NUME_DEPART: response.data[0].NUME_DEPART
          };
          if (response.data[0].DATA_INCEP) {
            let indexAngajare = response.data[0].DATA_INCEP.indexOf("T");
            if (indexAngajare > 0)
              response.data[0].DATA_INCEP = response.data[0].DATA_INCEP.substring(
                0,
                indexAngajare
              );
            this.dataAngajare = this.formatareDataDinBD(
              response.data[0].DATA_INCEP
            );
          } else {
            this.dataAngajare = null;
          }
          if (response.data[0].DATA_IES) {
            let indexPlecare = response.data[0].DATA_IES.indexOf("T");
            if (indexPlecare > 0)
              response.data[0].DATA_IES = response.data[0].DATA_IES.substring(
                0,
                indexPlecare
              );
            this.dataPlecare = this.formatareDataDinBD(
              response.data[0].DATA_IES
            );
          } else {
            this.dataPlecare = null;
          }
          if (response.data[0].DATA_ORA_OPER) {
            let indexInceput = response.data[0].DATA_ORA_OPER.indexOf("T");
            if (indexInceput > 0)
              response.data[0].DATA_ORA_OPER = response.data[0].DATA_ORA_OPER.substring(
                0,
                indexInceput
              );
            this.dataInceput = this.formatDate(
              this.formatareDataDinBD(response.data[0].DATA_ORA_OPER)
            );
          } else {
            this.dataInceput = null;
          }
          this.codCartela = response.data[0].COD_CARTELA;
          this.userLoading = false;
        });
    },
    dataAngajare() {
      this.dateFormattedAngajare = this.formatDate(this.dataAngajare);
    },
    dataPlecare() {
      this.dateFormattedPlecare = this.formatDate(this.dataPlecare);
    },
    judet() {
      axios
        .get(`//${ipServer}:3000/api/judete/${this.judet.ID_N_JUDET}`)
        .then(response => {
          this.listaLocatii = response.data;
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
