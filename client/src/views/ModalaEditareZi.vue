<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ titluModala }}</span>
    </v-card-title>
    <v-card-text class="pl-0">
      <v-container>
        <v-alert type="error" class="ml-5" v-if="alertaConcediu">
          <span>Alegeți tipul concediului!</span>
        </v-alert>
        <v-btn-toggle
          v-model="tipZi"
          tile
          color="deep-purple accent-3"
          group
          class="d-flex justify-center ml-4"
        >
          <v-btn value="LUCRATA" style="width:30%;">
            Lucrată
          </v-btn>
          <v-btn value="ABS_MOTIVATA" style="width:30%;">
            Concediu
          </v-btn>

          <v-btn value="ABS_NEMOTIVATA" style="width:40%;">
            Absență nemotivată
          </v-btn>
        </v-btn-toggle>
        <v-container v-if="ziCopie && tipZi === TIP_ZI.LUCRATA">
          <v-form ref="form" class="form" v-model="valid" lazy-validation>
            <div style="height:220px">
              <v-row>
                <v-col offset="2" cols="3" class="d-flex align-center pl-3">
                  ORA INTRARE:</v-col
                >
                <v-col cols="6" class="d-flex align-center">
                  <v-text-field
                    v-model="ziCopie.ORA_I"
                    outlined
                    @input="setTotalOre"
                    :rules="campObligatoriu"
                    style="height:60px;"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col offset="2" cols="3" class="d-flex align-center pl-3"
                  >ORA IEȘIRE:</v-col
                >
                <v-col cols="6" class="d-flex align-center">
                  <v-text-field
                    v-model="ziCopie.ORA_E"
                    outlined
                    @input="setTotalOre"
                    :rules="campObligatoriu"
                    style="height:60px;"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col offset="2" cols="3" class="d-flex align-center pl-3"
                  >TOTAL:</v-col
                >
                <v-col cols="6" class="d-flex align-center">
                  <v-text-field
                    v-model="oreReale"
                    outlined
                    disabled
                    style="height:60px;"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-container>
        <v-container
          v-if="ziCopie && tipZi === TIP_ZI.ABS_MOTIVATA"
          class="pl-4"
        >
          <v-select
            v-model="ziCopie.ORA_I"
            outlined
            class="ml-5 mr-2"
            label="Tip concediu"
            :items="coduriConcediu"
            item-value="cod"
            item-text="text"
            menu-props="auto"
            hide-details
            single-line
          ></v-select>
        </v-container>
      </v-container>
    </v-card-text>
    <v-card-actions style="padding-right:24px;">
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
          @click="salveaza"
          >SALVEAZĂ</v-btn
        >
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
  components: {},
  props: {
    zi: Object,
    ziCopie: Object,
    nrZiSelectata: Number
  },
  data() {
    return {
      nume: null,
      prenume: null,
      cnp: null,
      tipZi: null,
      yourFormat: "HH:mm",
      yourData: {
        hh: "03",
        mm: "05"
      },
      oraI: null,
      oraE: null,
      total: null,
      oreReale: "",
      TIP_ZI: {
        LUCRATA: "LUCRATA",
        ABS_MOTIVATA: "ABS_MOTIVATA",
        ABS_NEMOTIVATA: "ABS_NEMOTIVATA"
      },
      alertaConcediu: false,
      marca: null,
      coduriConcediu: [
        { cod: "AM", text: "Accident de muncă" },
        { cod: "SIND", text: "Activități sindicale" },
        { cod: "CC12", text: "Concediu creștere copil sub 12 ani" },
        { cod: "CM", text: "Concediu medical" },
        { cod: "CO", text: "Concediu de odihnă" },
        { cod: "COR", text: "Concediu de odihnă RESTANT" },
        { cod: "SUSP", text: "Contract de muncă suspendat" },
        { cod: "DFD", text: "Delegație fără diurnă" },
        { cod: "DEL", text: "Delegație cu diurnă" },
        { cod: "DET", text: "Detașare" },
        { cod: "IFP", text: "Învoire / Fără plată" },
        { cod: "PRB", text: "Program redus boală" },
        { cod: "REC", text: "Recuperare ore suplimentare" },
        { cod: "T", text: "Telemuncă" },
        { cod: "CCM", text: "Zi liberă plătită conform CCM" }
      ],
      showFailedAlert: false,
      campObligatoriu: [
        v =>
          (v && /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/.test(v)) ||
          "Introduceți o oră validă HH:MM (ex: 08:00)"
      ],
      totalObligatoriu: [
        v =>
          /^([0-9]):[0-5][0-9]$/.test(v) ||
          "Introduceți un totalde tip H:MM (ex: 8:30)"
      ]
    };
  },
  methods: {
    ...mapGetters(["getUser"]),
    toggleDialog() {
      this.alertaConcediu = false;
      this.oreReale = null;
      this.ziCopie = null;
      this.$emit("toggleDialogEditare");
    },
    isAdmin() {
      return this.getUser.data.admin;
    },
    completeaza() {
      this.ziCopie.ORA_I = "08:00";
      this.ziCopie.ORA_E = "16:30";
      this.ziCopie.PONTAT_REAL = "08:00";
    },
    setTotalOre() {
      if (this.tipZi === this.TIP_ZI.LUCRATA) {
        if (this.$refs.form.validate()) {
          let inArray = this.ziCopie.ORA_I.toString().split(":");
          let outArray = this.ziCopie.ORA_E.toString().split(":");
          let minuteReale;
          let oreReale;
          minuteReale =
            parseInt(outArray[0] * 60) +
            parseInt(outArray[1]) -
            parseInt(inArray[0] * 60) -
            parseInt(inArray[1]);
          if (parseInt(minuteReale / 60) >= 10) {
            oreReale = "10+";
          } else {
            oreReale =
              parseInt(minuteReale / 60) +
              ":" +
              (parseInt(minuteReale % 60) >= 10
                ? parseInt(minuteReale % 60)
                : "0" + parseInt(minuteReale % 60));
          }
          this.oreReale = oreReale;
        } else {
          this.oreReale = null;
        }
      }
    },
    salveaza() {
      (this.ziCopie);
      if (this.tipZi === this.TIP_ZI.LUCRATA && this.$refs.form.validate()) {
        if (
          this.ziCopie.TIP === this.TIP_ZI.ABS_MOTIVATA &&
          !this.ziCopie.ORA_I
        ) {
          this.alertaConcediu = true;
        } else {
          if (this.ziCopie.TIP === this.TIP_ZI.ABS_NEMOTIVATA) {
            this.ziCopie.ORA_I = "NEM";
          }
          if (
            this.oreReale &&
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(this.oreReale)
          ) {
            this.ziCopie.PONTAT_REAL = this.oreReale;
            this.$emit("ziEditata", [this.ziCopie, this.nrZiSelectata]);
            this.ziCopie = null;
            this.toggleDialog();
          }
        }
      } else {
        if (this.tipZi !== this.TIP_ZI.LUCRATA) {
          if (this.tipZi === this.TIP_ZI.ABS_MOTIVATA && !this.ziCopie.ORA_I) {
            this.alertaConcediu = true;
          } else {
            if (this.tipZi === this.TIP_ZI.ABS_NEMOTIVATA) {
              this.ziCopie.ORA_I = "NEM";
            }
            this.$emit("ziEditata", [this.ziCopie, this.nrZiSelectata]);
            this.ziCopie = null;
            this.toggleDialog();
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(["getUser"]),
    isSuperAdmin() {
      if (this.getUser && this.getUser.data)
        return this.getUser.data.admin === 2;
      return false;
    },
    titluModala() {
      if (this.zi && this.zi.TIP) {
        return "Editare zi";
      }
      return "Adăugare zi";
    }
  },
  watch: {
    ziCopie: function() {
      if (this.ziCopie.ORA_I === "null") {
        this.ziCopie.ORA_I = null;
      }
      if (this.ziCopie.ORA_E === "null") {
        this.ziCopie.ORA_E = null;
      }
      if (this.ziCopie.PONTAT_REAL === "null") {
        this.ziCopie.PONTAT_REAL = null;
      }
      this.oraI = this.ziCopie.ORA_I;
      this.oraE = this.ziCopie.ORA_E;
      this.oreReale = this.ziCopie.PONTAT_REAL;
      this.total = this.ziCopie.PONTAT_REAL;
      this.tipZi = this.ziCopie.TIP;
    },
    tipZi() {
      if (this.tipZi === this.TIP_ZI.LUCRATA) {
        if (/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/.test(this.oraE)) {
          this.ziCopie.ORA_E = this.oraE;
        } else {
          this.ziCopie.ORA_E = null;
        }
        if (/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/.test(this.oraI)) {
          this.ziCopie.ORA_I = this.oraI;
        } else {
          this.ziCopie.ORA_I = null;
        }
        this.ziCopie.PONTAT_REAL = this.total;
      } else {
        this.ziCopie.ORA_E = null;
        this.ziCopie.ORA_I = null;
        this.ziCopie.PONTAT_REAL = null;
      }
      this.ziCopie.TIP = this.tipZi;
      this.alertaConcediu = false;
    }
  },
  mounted() {
    if (this.ziCopie) {
      if (this.ziCopie.ORA_I === "null") {
        this.ziCopie.ORA_I = null;
      }
      if (this.ziCopie.ORA_E === "null") {
        this.ziCopie.ORA_E = null;
      }
      if (this.ziCopie.TIP === this.TIP_ZI.LUCRATA) {
        this.oraI = this.ziCopie.ORA_I;
        this.oraE = this.ziCopie.ORA_E;
        this.total = this.ziCopie.PONTAT_REAL;
        this.oreReale = this.ziCopie.PONTAT_REAL;
      }
      this.tipZi = this.ziCopie.TIP;
    }
  }
};
</script>

<style lang="scss" scoped></style>
