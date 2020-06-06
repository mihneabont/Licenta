<template>
  <v-layout class="align-center" style="height:100%" v-on:keyup.enter="login">
    <div
      id="inregistrare"
      class="d-flex flex-row justify-center"
      style="width:100%"
    >
      <v-form ref="form" class="form" v-model="valid" lazy-validation>
        <v-alert type="error" v-if="showWrongLoginAlert">
          <span>Nume sau parola gresite!</span>
        </v-alert>
        <div class="mb-6">
          <h1>Autentificare</h1>
        </div>

        <v-text-field
          v-model="nume_utilizator"
          label="Nume"
          required
          :rules="numeUtilizatorRules"
          outlined
        ></v-text-field>

        <v-text-field
          v-model="parola"
          required
          :rules="parolaRules"
          type="password"
          outlined
          name="input-10-1"
          class="mb-4"
          label="Parola"
        ></v-text-field>

        <v-btn class="d-flex ml-auto primary button-sizes" @click="login"
          >CONECTARE</v-btn
        >
      </v-form>
    </div>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      valid: true,
      nume_utilizator: "",
      parola: "",
      showWrongLoginAlert: false,
      numeUtilizatorRules: [v => !!v || "Nu ati introdus numele"],
      parolaRules: [v => !!v || "Nu ati introdus parola"]
    };
  },
  methods: {
    ...mapGetters(["getUser"]),
    login() {
      if (this.$refs.form.validate()) {
        this.showWrongLoginAlert = false;
        this.$store
          .dispatch("login", {
            nume_utilizator: this.nume_utilizator,
            parola: this.parola
          })
          .then(() => {
            this.$router.push({ name: "dashboard" });
          })
          .catch(err => {
            if (err.response.data.error === "Invalid login") {
              this.showWrongLoginAlert = true;
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.form {
  width: 25%;
}
.button-sizes {
  width: 150px;
  height: 46px !important;
}
</style>
