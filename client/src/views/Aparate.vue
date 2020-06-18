<template>
  <v-container fluid fill-height>
    <v-col cols="12" style="height:100%">
      <v-row>
        <v-col offset="2" cols="6" class="d-flex align-center">
          <v-text-field
            v-model="tokenAparat"
            outlined
            style="height:50px;"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-btn
            class="primary d-flex justify-center"
            style="width:100% !important;"
            @click="getToken"
            >TOKEN NOU</v-btn
          >
        </v-col>
      </v-row>
      <v-container>
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
                Nu a fost înregistrat nici un aparat
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-container>
</template>

<script>
import axios from "axios";
import { ipServer } from "./ipServer";

export default {
  name: "app",
  data() {
    return {
      headers: [
        {
          text: "NR APARAT",
        },
        { text: "UID APARAT", value: "COD_CARTELA" },
      ],
      footer_props: {
        "items-per-page-options": [],
        "items-per-page-text": "",
        "disable-items-per-page": true,
      },
      tableItems: [],
      tokenAparat:''
    };
  },
  methods: {
    getToken() {
      axios.get(`//${ipServer}:3000/api/aparate/token`).then(response => {
        this.tokenAparat = response.data.tokenAparat;
      });
    },
  },
  watch: {},
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
