<template>
  <v-container fill-height>
    <v-snackbar
      color="amber darken-3"
      :timeout="100000"
      v-model="generationAlert"
      top
      class="mt-5"
    >
      <v-progress-circular indeterminate></v-progress-circular>
      Se generează foaia de prezență
    </v-snackbar>
    <v-snackbar
      v-model="doneAlert"
      :timeout="2000"
      color="success"
      top
      class="mt-5"
    >
      <i
        class="fa fa-check-square-o"
        aria-hidden="true"
        style="font-size:25px;"
      ></i>
      Foaie de prezență generată
    </v-snackbar>
    <v-item-group align-center style="width:100%">
      <v-row class="d-flex flex-row justify-center">
        <v-col v-for="optiune in optiuniC" :key="optiune.titlu" md="2">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="itemColor(optiune)"
              dark
              elevation="16"
              height="200"
              @click="redirect(optiune)"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline d-flex justify-center">{{
                    optiune.titlu
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="height:80px" class="d-flex justify-center">
                <i
                  :class="optiune.icon"
                  aria-hidden="true"
                  style="font-size:50px;"
                ></i>
              </v-list-item>
              <v-list-item class="d-flex justify-center">
                <span>{{ optiune.descriere }}</span>
              </v-list-item>
            </v-card>
          </v-item>
        </v-col>
        <v-dialog v-model="dialogConfirmare" persistent max-width="500px">
          <modala-confirmare-date
            @toggleDialogConfirmare="dialogConfirmare = !dialogConfirmare"
          ></modala-confirmare-date>
        </v-dialog>
        <v-dialog v-model="dialogPrezenta" persistent max-width="500px">
          <modala-prezenta
            @toggleDialogPrezenta="dialogPrezenta = !dialogPrezenta"
            @showGenerationAlert="generationAlert = true"
            @showDoneAlert="
              generationAlert = false;
              doneAlert = true;
            "
          ></modala-prezenta> </v-dialog
      ></v-row>
    </v-item-group>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
import ModalaConfirmareDate from "./ModalaConfirmareDate";
import ModalaPrezenta from "./ModalaPrezenta";
import { ipServer } from "./ipServer";
const axios = require("axios");

export default {
  components: { ModalaConfirmareDate, ModalaPrezenta },
  computed: {
    ...mapGetters(["getUser"]),
    optiuniC() {
      if (this.getUser.data.admin) {
        if (this.getUser.data.idAngajat === 99999) {
          return this.optiuni;
        }
        return this.optiuniAdminReg;
      } else {
        return this.optiuniReg;
      }
    }
  },
  data() {
    return {
      dialogConfirmare: false,
      dialogPrezenta: false,
      doneAlert: false,
      snackbarGhid:true,
      generationAlert: false,
      optiuni: [
        {
          titlu: "Angajați",
          icon: "fa fa-users",
          descriere: "Listă completă cu angajați",
          path: "/angajati"
        },
        {
          titlu: "Calendar",
          icon: "fa fa-calendar",
          descriere: "Pontajele zilnice ale angajaților",
          path: "/calendar"
        },
        {
          titlu: "Confirmă date",
          icon: "fa fa-check-square-o",
          descriere: "Confirmare pontaj pe luni"
        },
        {
          titlu: "Foaie prezență",
          icon: "fa fa-file-pdf-o",
          descriere: "Generare PDF cu date de pontaj"
        },
        {
          titlu: "Adaugă pontaj",
          icon: "fa fa-file-text-o",
          descriere: "Încărcare fișier cu date pontaj",
          path: "/adaugare"
        },

        {
          titlu: "Ieșire",
          icon: "fa fa-sign-out",
          descriere: "Deconectare",
          path: "/autentificare"
        }
      ],
      optiuniAdminReg: [
        {
          titlu: "Calendar",
          icon: "fa fa-calendar",
          descriere: "Pontajele zilnice ale angajaților",
          path: "/calendar"
        },
        {
          titlu: "Confirmă date",
          icon: "fa fa-check-square-o",
          descriere: "Confirmare pontaj pe luni"
        },
        {
          titlu: "Foaie prezență",
          icon: "fa fa-file-pdf-o",
          descriere: "Generare PDF cu date de pontaj"
        },
        {
          titlu: "Adaugă pontaj",
          icon: "fa fa-file-text-o",
          descriere: "Încărcare fișier cu date pontaj",
          path: "/adaugare"
        },

        {
          titlu: "Ieșire",
          icon: "fa fa-sign-out",
          descriere: "Deconectare",
          path: "/autentificare"
        }
      ],
      optiuniReg: [
        {
          titlu: "Calendar",
          icon: "fa fa-calendar",
          descriere: "Pontajele zilnice ale angajaților",
          path: "/calendar"
        },
        {
          titlu: "Ieșire",
          icon: "fa fa-sign-out",
          descriere: "Deconectare",
          path: "/autentificare"
        }
      ]
    };
  },
  methods: {
    ...mapGetters(["getUser"]),
    redirect(optiune) {
      if (optiune.titlu === "Ieșire") {
        this.$store.commit("LOGOUT");
      }
      if (optiune.titlu === "Confirmă date") {
        this.dialogConfirmare = true;
      }
      if (optiune.titlu === "Foaie prezență") {
        this.dialogPrezenta = true;
      }
      if (optiune.path) {
        this.$router.push(optiune.path);
      }
    },
    itemColor(optiune) {
      if (optiune.titlu === "Ieșire") {
        return "error";
      }
      return "primary";
    },
    createAndDownloadPdf() {
      let state = {
        name: "",
        receiptId: 0,
        price1: 0,
        price2: 0
      };
      return axios.post(`//${ipServer}:3000/api/create-pdf`, state).then(() => {
        axios
          .get(`//${ipServer}:3000/api/fetch-pdf`, { responseType: "blob" })
          .then(res => {
            const pdfBlob = new Blob([res.data], { type: "application/pdf" });
            saveAs(pdfBlob, "newPDF.pdf");
          });
      });
    }
  },
  mounted() {},
  created() {
    axios.get(`//${ipServer}:3000/api/departamente`).then(() => {
      console.log("Conectat");
    });
  }
};
</script>

<style lang="scss" scoped>
.h-100 {
  height: 100%;
}
</style>
