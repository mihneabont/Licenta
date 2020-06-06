<template>
  <v-layout class="align-center" style="height:100%">
    <div id="inregistrare" class="d-flex flex-row justify-center" style="width:100%">
      <v-form ref="form" class="registerForm" v-model="valid" lazy-validation>
        <div class="mb-2">
          <h1>Inregistrare</h1>
        </div>
        <v-text-field v-model="name" :rules="nameRules" label="Nume" required></v-text-field>

        <v-text-field v-model="prenume" :rules="nameRules" label="Prenume" required></v-text-field>

        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

        <v-text-field
          v-model="password"
          required
          :append-icon="show1 ? 'fa-eye' : 'fa-eye-slash'"
          :rules="passwordRules"
          :type="show1 ? 'text' : 'password'"
          name="input-10-1"
          label="Parola"
          hint="At least 8 characters"
          counter
          @click:append="show1 = !show1"
        ></v-text-field>

        <v-checkbox
          v-model="checkbox"
          :rules="[v => !!v || 'Trebuie sa fiti de acord!']"
          label="Sunt de acord cu Termenii si conditiile"
          required
        ></v-checkbox>

        <v-btn class="d-flex ml-auto primary" @click="validate">Creeaza cont</v-btn>
      </v-form>
    </div>
  </v-layout>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      show1: false,
      password: null,
      passwordRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 8) || "Min 8 carachters"
      ],
      valid: true,
      name: "",
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      prenume: "",
      prenumeRules: [
        v => !!v || "Prenume is required",
        v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      select: null,
      checkbox: false
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        // eslint-disable-next-line no-console
        this.$store.dispatch('register',{
          name:this.name,
          prenume:this.prenume,
          email:this.email,
          password:this.password
        }).then();
      }
    },
    login() {
    }
  }
};
</script>

<style lang = "scss" scoped>
.registerForm {
  width: 25%;
}
</style>
