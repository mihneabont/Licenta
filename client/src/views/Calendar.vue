<template>
  <v-container fluid fill-height>
    <v-col cols="2" style="height:100%">
      <v-row class="d-flex justify-center">
        <v-select
          v-model="judet"
          outlined
          dense
          :items="listaJudete"
          item-text="JUDET"
          return-object
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-row>
      <v-row class="mt-1 d-flex justify-center title"> LOCAȚIE </v-row>
      <v-row class="d-flex justify-center">
        <v-select
          v-model="locatie"
          dense
          outlined
          :items="listaLocatii"
          item-text="LOCATIA"
          return-object
          menu-props="auto"
          hide-details
          single-line
        ></v-select>
      </v-row>
      <v-row class="mt-1 d-flex justify-center title"> DEPARTAMENT </v-row>
      <v-row class="d-flex justify-center">
        <v-select
          v-model="departament"
          outlined
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
      <v-row class="d-flex justify-center mt-3 mb-3 title"
        ><span>Date angajat</span></v-row
      >
      <v-row class="d-flex justify-center">
        <v-simple-table dense style="width:100%">
          <template v-slot:default>
            <tbody>
              <tr>
                <td class="d-flex">Marca</td>
                <td>{{ marca }}</td>
              </tr>
              <tr>
                <td class="d-flex">Cartela</td>
                <td>{{ codCartela }}</td>
              </tr>
              <tr>
                <td class="d-flex">Angajare</td>
                <td>{{ dataAngajare }}</td>
              </tr>
              <tr>
                <td class="d-flex">Plecare</td>
                <td>{{ dataPlecare }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>

      <v-row class="d-flex justify-center mt-3 title"
        ><span>Zile nelucrate</span></v-row
      >
      <v-row class="d-flex justify-center">
        <v-col cols="6" class=" pl-0 pr-0">
          <v-simple-table dense style="width:100%">
            <template v-slot:default>
              <tbody>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>NEM</span>
                      </td>

                      <td>{{ totale.NEM || 0 }}</td>
                    </tr>
                  </template>
                  <span>Absențe nemotivate</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>AM</span>
                      </td>

                      <td>{{ totale.AM || 0 }}</td>
                    </tr>
                  </template>
                  <span>Accidente de muncă</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>SIND</span>
                      </td>

                      <td>{{ totale.SIND || 0 }}</td>
                    </tr>
                  </template>
                  <span>Activități sindicale</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>CM</span>
                      </td>

                      <td>{{ totale.CM || 0 }}</td>
                    </tr>
                  </template>
                  <span>Concediu medical</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>CO</span>
                      </td>

                      <td>{{ totale.CO || 0 }}</td>
                    </tr>
                  </template>
                  <span>Concediu odihnă</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>COR</span>
                      </td>

                      <td>{{ totale.COR || 0 }}</td>
                    </tr>
                  </template>
                  <span>Concediu odihnă restant</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>SUSP</span>
                      </td>

                      <td>{{ totale.SUSP || 0 }}</td>
                    </tr>
                  </template>
                  <span>Contract muncă suspendat</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>T</span>
                      </td>

                      <td>{{ totale.T || 0 }}</td>
                    </tr>
                  </template>
                  <span>Telemuncă</span>
                </v-tooltip>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col cols="6" class="pr-0 pl-0">
          <v-simple-table dense style="width:100%">
            <template v-slot:default>
              <tbody>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>DFD</span>
                      </td>

                      <td>{{ totale.DFD || 0 }}</td>
                    </tr>
                  </template>
                  <span>Delegații fără diurnă</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>DET</span>
                      </td>

                      <td>{{ totale.DET || 0 }}</td>
                    </tr>
                  </template>
                  <span>Detașare</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>DEL</span>
                      </td>

                      <td>{{ totale.DEL }}</td>
                    </tr>
                  </template>
                  <span>Delegații cu diurnă</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>IFP</span>
                      </td>

                      <td>{{ totale.IFP || 0 }}</td>
                    </tr>
                  </template>
                  <span>Învoiri / Fără plată</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>PRB</span>
                      </td>

                      <td>{{ totale.PRB || 0 }}</td>
                    </tr>
                  </template>
                  <span>Program redus boală</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>REC</span>
                      </td>

                      <td>{{ totale.REC || 0 }}</td>
                    </tr>
                  </template>
                  <span>Recuperare ore suplimentare</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>CCM</span>
                      </td>

                      <td>{{ totale.CCM || 0 }}</td>
                    </tr>
                  </template>
                  <span>Zile libere plătite CCM</span>
                </v-tooltip>
                                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <tr v-on="on">
                      <td class="d-flex">
                        <span>CC12</span>
                      </td>

                      <td>{{ totale.CC12 || 0 }}</td>
                    </tr>
                  </template>
                  <span>Concediu creștere copil sub 12 ani</span>
                </v-tooltip>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center mt-3 title"
        ><span>Total ore înregistrate</span></v-row
      >
      <v-row class="d-flex justify-center title">
        <span>{{ totalOrePontate }}</span>
      </v-row>
      <v-row class="d-flex justify-center mt-3"
        ><v-card
          color="primary"
          class="title d-flex justify-center"
          style="width:200px; color:white"
          >Bonuri de masă: {{ bonuri }}</v-card
        ></v-row
      >
    </v-col>
    <v-col cols="10" style="height:100%" class="ml-2">
      <v-row class="d-flex pl-0">
        <v-col
          cols="4"
          class=" pl-0 pt-2 d-flex align-center"
          style="height:60px;"
        >
          <v-select
            v-model="selectedUser"
            outlined
            dense
            label="Angajat"
            :items="listaAngajatiFiltrata"
            item-value="ID_SALARIAT"
            return-object
            @blur="search = ''"
            menu-props="auto"
            hide-details
            single-line
          >
            <template v-slot:prepend-item>
              <div style="height:60px;padding-right:5px;padding-left:5px;">
                <v-text-field
                  outlined
                  dense
                  prepend-inner-icon="fa-search"
                  v-model="search"
                ></v-text-field>
              </div>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template slot="selection" slot-scope="{ item }">
              {{ item.NUME }} {{ item.PRENUME }}
            </template>
            <template slot="item" slot-scope="{ item }">
              {{ item.NUME }} {{ item.PRENUME }}
            </template></v-select
          >
        </v-col>
        <v-col offset="4" cols="1" v-if="editVisible"
          ><v-btn
            class="primary d-flex justify-center ml-auto"
            style="min-width:10px !important;"
            v-if="isAdmin()"
            @click="toggleEditVisible"
          >
            <i class="fa fa-pencil" aria-hidden="true"></i> </v-btn
        ></v-col>
        <v-col cols="5" class="d-flex" style="height:60px;" v-else>
          <div class="d-flex" v-if="!editVisible && !selectareM">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    class="primary d-flex"
                    style="margin-right:10px;"
                    @click="selectareMultipla"
                  >
                    <i class="fa fa-th mr-1"></i>
                    <span>AM</span>
                  </v-btn>
                </div>
              </template>
              <span>Adăugare multiplă</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    class="primary d-flex"
                    style="margin-right:10px;"
                    @click="dialogCompletare = true"
                  >
                    <i class="fa fa-check-square mr-1"></i>
                    <span>CA</span>
                  </v-btn>
                </div>
              </template>
              <span>Completează automat totale</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    class="primary d-flex"
                    style="margin-right:10px;"
                    @click="dialogCompletareToateZilele = true"
                  >
                    <i class="fa fa-calendar-check-o mr-1"></i>
                    <span>CAT</span>
                  </v-btn>
                </div>
              </template>
              <span>Completează automat toate zilele</span>
            </v-tooltip>
          </div>
          <div class="d-flex" v-if="!editVisible && selectareM">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    class="error d-flex"
                    style="margin-right:10px;"
                    @click="anulareSM()"
                  >
                    <i class="fa fa-times  mr-1"></i>
                    <span>AN</span>
                  </v-btn>
                </div>
              </template>
              <span>Anulare selecție</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    class="success d-flex"
                    style="margin-right:10px;"
                    @click="salveazaMultiple"
                  >
                    <i class="fa fa-check mr-1"></i>
                    <span>SV</span>
                  </v-btn>
                </div>
              </template>
              <span>Salvare selecție</span>
            </v-tooltip>
          </div>
          <v-btn
            class="error d-flex justify-center ml-auto"
            style="width:20% !important;"
            :disabled="selectareM"
            v-if="!editVisible"
            @click="anulare"
            >ANULARE</v-btn
          >
          <v-btn
            class="success d-flex justify-center ml-3"
            style="width:20% !important;"
            v-if="!editVisible"
            :disabled="selectareM"
            @click="salveaza"
            >SALVEAZA</v-btn
          >
        </v-col>
        <v-col cols="3" style="height:60px;" class="d-flex pt-0">
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
              <v-text-field
                v-model="date"
                label="Luna"
                prepend-icon="fa fa-calendar-o"
                readonly
                v-on="on"
              ></v-text-field>
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
        </v-col>
      </v-row>
      <v-row
        style="height:70vh"
        class="pr-3 pt-1 d-flex justify-center align-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="70"
          v-if="showLoading"
        ></v-progress-circular>
        <v-calendar
          v-else
          :value="calendarDate"
          color="primary"
          ref="calendar"
          locale="ro"
          :short-weekdays="false"
        >
          <template
            v-slot:day="{ present, past, date, weekday, month, year, day }"
          >
            <v-row class="fill-height d-flex justify-center">
              <v-card
                color="teal lighten-3"
                elevation="12"
                :width="`80%`"
                @click="editareZi(day, month, year)"
                height="100%"
                v-if="
                  month == getMonth(calendarDate) &&
                    listaZile &&
                    listaZile[day] &&
                    listaZile[day].TIP === TIP_ZI.LUCRATA
                "
              >
                <v-row class="d-flex justify-center body-2"
                  >INTRARE: {{ oraI(day) }}</v-row
                >
                <v-row class="d-flex justify-center body-2"
                  >IESIRE: {{ oraE(day) }}</v-row
                >
                <v-divider class="ml-5" style="width:75%"></v-divider>
                <v-row class="d-flex justify-center body-2"
                  >TOTAL: {{ real(day) || "????" }}</v-row
                >
              </v-card>
              <!-- light-green lighten-2 -->
              <v-card
                color="light-green lighten-2"
                class=""
                elevation="12"
                :width="`80%`"
                @click="editareZi(day, month, year)"
                height="100%"
                v-if="
                  month == getMonth(calendarDate) &&
                    listaZile &&
                    listaZile[day] &&
                    listaZile[day].TIP === TIP_ZI.ABS_MOTIVATA
                "
              >
                <v-row class="d-flex justify-center body-2 mt-2">
                  <i class="fa fa-check-circle-o fa-2x"></i>
                </v-row>
                <v-row class="d-flex justify-center">
                  <span class="headline"> {{ listaZile[day].ORA_I }}</span>
                </v-row>
              </v-card>
              <v-card
                color="orange accent-2"
                class=""
                elevation="12"
                :width="`80%`"
                @click="editareZi(day, month, year)"
                height="100%"
                v-if="
                  month == getMonth(calendarDate) &&
                    listaZileComp &&
                    listaZileComp[day] &&
                    listaZileComp[day].TIP === TIP_ZI.ABS_NEMOTIVATA
                "
              >
                <v-row class="d-flex justify-center body-2 mt-2">
                  <i class="fa fa-question fa-2x"></i>
                </v-row>
                <v-row class="d-flex justify-center">
                  <span class="headline"> NEM</span>
                </v-row>
              </v-card>
              <v-card
                color="white"
                class=""
                elevation="12"
                :width="`80%`"
                height="100%"
                @click="editareZi(day, month, year, weekday)"
                v-if="
                  month == getMonth(calendarDate) &&
                    listaZile &&
                    !listaZile[day] &&
                    !editVisible &&
                    !isSarbatoare(date) &&
                    weekday !== 0 &&
                    weekday !== 6
                "
              >
                <v-row
                  v-if="!selectareM"
                  class="d-flex justify-center body-2 mt-5"
                >
                  <i class="fa fa-plus-circle fa-3x" aria-hidden="true"></i>
                </v-row>
                <v-row
                  v-if="selectareM && !nrZileSelectate.includes(day)"
                  class="d-flex justify-center body-2 mt-5"
                >
                  <i class="fa fa-square-o fa-3x" aria-hidden="true"></i>
                </v-row>
                <v-row
                  v-if="selectareM && nrZileSelectate.includes(day)"
                  class="d-flex justify-center body-2 mt-5"
                >
                  <i class="fa fa-check-square-o fa-3x" aria-hidden="true"></i>
                </v-row>
                <v-row class="d-flex justify-center"> </v-row>
              </v-card>
              <!-- <v-card
                color="orange accent-2"
                elevation="12"
                :width="`80%`"
                height="100%"
                v-if="!hasData(weekday) && month == getMonth(calendarDate)"
                 @click="getMonth()"
              >
                <v-row class="d-flex justify-center body-2">NO: 08:30</v-row>
                <v-row class="d-flex justify-center body-2"
                  ><v-col cols="6" class="pb-0 pt-0 pr-0 pl-4">PR: 07:20</v-col>
                  <v-col cols="6" class="pb-0 pt-0 pl-0"
                    >PC: 07:10</v-col
                  ></v-row
                >
                <v-row class="d-flex justify-center body-2"
                  ><v-col cols="6" class="pb-0 pt-0 pr-0 pl-4">±P: 00:20</v-col>
                  <v-col cols="6" class="pb-0 pt-0 pl-0">±C:</v-col></v-row
                ></v-card
              > -->
            </v-row>
          </template>
        </v-calendar>
      </v-row>
    </v-col>
    <v-dialog v-model="dialog" max-width="600px"
      ><modala-editare-zi
        @toggleDialogEditare="toggleDialogEditare"
        @ziEditata="modificareZi"
        :zi="ziSelectata"
        :nrZiSelectata="nrZiSelectata"
        :ziCopie="{ ...ziSelectata }"
      ></modala-editare-zi
    ></v-dialog>
    <v-dialog v-model="dialogMultipla" max-width="600px"
      ><modala-editare-multipla
        @toggleDialogEditare="toggleDialogEditareMultipla"
        @ziMultipla="modificareZileMultiple"
        :zi="ziSelectata"
        :nrZiSelectata="nrZiSelectata"
        :ziCopie="ziSelectata"
      ></modala-editare-multipla
    ></v-dialog>
    <v-dialog v-model="dialogCompletare" max-width="500">
      <v-card>
        <v-card-title class="headline"
          >Doriți să completați automat totalele?</v-card-title
        >

        <v-card-text>
          Completarea automată pentru totale adaugă în zilele în care angajatul
          selectat a pontat doar la intrare sau doar la ieșire un total de 8:30
          în zilele de Luni până Joi și de 6:00 Vineri
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
              @click="dialogCompletare = false"
              >ANULARE</v-btn
            >
          </v-col>
          <v-col cols="4" class="d-flex">
            <v-btn
              class="success d-flex justify-center"
              style="width:100% !important;"
              @click="completeazaAutomat"
              >COMPLETEAZĂ</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCompletareToateZilele" max-width="500">
      <v-card>
        <v-card-title class="headline"
          >Doriți să completați automat toate zilele?</v-card-title
        >

        <v-card-text>
          <div style="margin-left:10px;">
            <v-row
              >Completarea automată pentru toate zilele adaugă în toate zilele
              care nu au nimic completat urmatorul program:</v-row
            >
            <v-row style="margin-top:10px;">Luni-Joi:</v-row>
            <v-row>INTRARE: 08:00</v-row>
            <v-row>IEȘIRE: 16:30</v-row>
            <v-row>TOTAL: 8:30</v-row>
            <v-row style="margin-top:10px;">Vineri:</v-row>
            <v-row>INTRARE: 08:00</v-row>
            <v-row>IEȘIRE: 14:00</v-row>
            <v-row>TOTAL: 6:00</v-row>
          </div>
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
              @click="dialogCompletareToateZilele = false"
              >ANULARE</v-btn
            >
          </v-col>
          <v-col cols="4" class="d-flex">
            <v-btn
              class="success d-flex justify-center"
              style="width:100% !important;"
              @click="completeazaAutomatToateZilele"
              >COMPLETEAZĂ</v-btn
            >
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ModalaEditareZi from "./ModalaEditareZi";
import ModalaEditareMultipla from "./ModalaEditareMultipla";
import { ipServer } from "./ipServer";
const CODURI_CONCEDIU = [
  "AM",
  "SIND",
  "CM",
  "CO",
  "COR",
  "SUSP",
  "T",
  "DFD",
  "DET",
  "DEL",
  "IFP",
  "PRB",
  "REC",
  "CCM",
  "CC12"
];
import axios from "axios";
import { mapGetters } from "vuex";

const TIP_ZI = {
  LUCRATA: "LUCRATA",
  ABS_MOTIVATA: "ABS_MOTIVATA",
  ABS_NEMOTIVATA: "ABS_NEMOTIVATA"
};
export default {
  components: { ModalaEditareZi, ModalaEditareMultipla },
  data() {
    return {
      search: "",
      selectedUser: null,
      departament: null,
      judet: null,
      lastPick: "",
      locatie: null,
      bonuri: null,
      totalOrePontate: null,
      date: new Date().toISOString().substr(0, 7),
      menu: false,
      ziSelectata: null,
      month: null,
      dialog: false,
      dateSarbatori: [],
      dialogMultipla: false,
      dialogCompletare: false,
      dialogCompletareToateZilele: false,
      showLoading: true,
      selectareM: false,
      zileSelectate: [],
      nrZileSelectate: [],
      marca: "",
      dataAngajare: "",
      dataPlecare: "",
      codCartela: "",
      listaAngajati: [],
      nrZiSelectata: null,
      editVisible: true,
      TIP_ZI: {
        LUCRATA: "LUCRATA",
        ABS_MOTIVATA: "ABS_MOTIVATA",
        ABS_NEMOTIVATA: "ABS_NEMOTIVATA"
      },
      calendarDate: null,
      listaDepartamente: [],
      listaJudete: [],
      listaLocatii: [],
      listaZile: {},
      copieListaZile: {},
      angajati: [],
      totale: {
        DEL: 0,
        AM: 0,
        SIND: 0,
        CM: 0,
        CO: 0,
        COR: 0,
        SUSP: 0,
        T: 0,
        CC12:0,
        DFD: 0,
        NEM: 0,
        DET: 0,
        IFP: 0,
        PRD: 0,
        REC: 0,
        CCM: 0
      },
      zile: [
        {
          ID_PONTAJ: 1,
          DATA_PONTAJ: "08/10/2019",
          PONTAT_REAL: "08:20",
          ORA_I: "08:00",
          ORA_E: "16:00"
        },
        {
          ID_PONTAJ: 3,
          DATA_PONTAJ: "09/10/2019",
          PONTAT_REAL: "",
          ORA_I: "",
          ORA_E: ""
        },
        {
          ID_PONTAJ: 2,
          DATA_PONTAJ: "10/10/2019",
          PONTAT_REAL: "33:20",
          ORA_I: "09:00",
          ORA_E: "12:00"
        },
        {
          ID_PONTAJ: 3,
          DATA_PONTAJ: "16/10/2019",
          PONTAT_REAL: "08:20",
          ORA_I: "CO",
          ORA_E: "null"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    listaAngajatiFiltrata() {
      var lowSearch = this.search.toLowerCase();
      let keys = ["NUME", "PRENUME", "MARCA", "COMPLET"];
      return this.listaAngajati.filter(function(angajat) {
        angajat.COMPLET = angajat.NUME + " " + angajat.PRENUME;
        return keys.some(key =>
          String(angajat[key])
            .toLowerCase()
            .startsWith(lowSearch)
        );
      });
    },
    bonuriDeMasa() {
      let bonuri = 0;
      if (this.listaZile) {
        Object.entries(this.listaZile).forEach(([key, val]) => {
          if (key && val.TIP === TIP_ZI.LUCRATA) {
            bonuri++;
          }
        });
      }
      return bonuri;
    },
    totaleDel() {
      return this.totale.DEL ? this.totale.DEL : "0";
    },
    absMotivata(day) {
      return (
        this.listaZile &&
        this.listaZile[day] &&
        this.listaZile[day].TIP === this.TIP_ZI.ABS_MOTIVATA
      );
    },
    isSuperAdmin() {
      if (this.getUser && this.getUser.data)
        return this.getUser.data.admin === 2;
      return false;
    },
    listaZileComp() {
      return this.listaZile;
    }
  },
  methods: {
    toggleEditVisible() {
      this.copieListaZile = JSON.parse(JSON.stringify(this.listaZile));
      this.editVisible = !this.editVisible;
    },
    isSarbatoare(date){
      let gasit = false;
      this.dateSarbatori.forEach((element) => {
        if(date === element){
          gasit = true;
        }
      })
      return gasit;
    },
    isAdmin() {
      return this.getUser.data.admin;
    },
    
    selectareMultipla() {
      this.selectareM = true;
    },
    salveazaMultiple() {
      this.dialogMultipla = true;
    },
    completeazaAutomat() {
      Object.entries(this.listaZile).forEach((part, index, theArray) => {
        var dateParts = part[1].DATA_PONTAJ.split("/");
        var dateObject = new Date(
          +dateParts[2],
          dateParts[1] - 1,
          +dateParts[0]
        );
        if (
          (part[1].ORA_I || part[1].ORA_E) &&
          !CODURI_CONCEDIU.includes(part[1].ORA_I) &&
          part[1].ORA_I !== "NEM" &&
          (!part[1].PONTAT_REAL ||
            part[1].PONTAT_REAL === "0:00" ||
            part[1].PONTAT_REAL === "????")
        ) {
          if (dateObject.getDay() !== 5)
            theArray[index][1].PONTAT_REAL = "8:30";
          else {
            theArray[index][1].PONTAT_REAL = "6:00";
          }
        }
      });
      this.calculTotale();
      this.calculTotalOre();
      this.calculBonuriDeMasa();
      this.editVisible = !this.editVisible;
      this.editVisible = !this.editVisible;
      this.dialogCompletare = false;
    },
    completeazaAutomatToateZilele() {
      let nrZileLuna = new Date(
        this.date.split("-")[0],
        this.date.split("-")[1],
        0
      ).getDate();
      for (let i = 1; i <= nrZileLuna; i++) {
        var dateObject = new Date(
          this.date.split("-")[0],
          this.date.split("-")[1] - 1,
          i
        );
        let data = "";
        let luna = "";
        let zi = "";
        if(dateObject.getMonth() < 9){
          luna = "0" + (dateObject.getMonth() +1);
        } else {
          luna =  (dateObject.getMonth() +1);
        }
        if(dateObject.getDate() < 10){
          zi = "0" + dateObject.getDate();
        } else {
          zi =  dateObject.getDate();
        }
        data = dateObject.getFullYear() + "-" + luna + "-" + zi;
        console.log(data);
        console.log(this.dateSarbatori);
        console.log(this.isSarbatoare(data));
        if (dateObject.getDay() !== 6 && dateObject.getDay() !== 0 && !this.isSarbatoare(data)) {
          if (!this.listaZile[i]) {
            let dataPontaj;
            if (i < 10) {
              dataPontaj = `0${i}/${this.date.split("-")[1]}/${
                this.date.split("-")[0]
              }`;
            } else {
              dataPontaj = `${i}/${this.date.split("-")[1]}/${
                this.date.split("-")[0]
              }`;
            }
            if (dateObject.getDay() !== 5) {
              this.listaZile[i] = {
                ID_PONTAJ: null,
                DATA_PONTAJ: dataPontaj,
                PONTAT_REAL: "8:30",
                ORA_I: "08:00",
                ORA_E: "16:30",
                TIP: "LUCRATA"
              };
            } else {
              this.listaZile[i] = {
                ID_PONTAJ: null,
                DATA_PONTAJ: dataPontaj,
                PONTAT_REAL: "6:00",
                ORA_I: "08:00",
                ORA_E: "14:00",
                TIP: "LUCRATA"
              };
            }
          }
        }
      }
      this.dialogCompletareToateZilele = false;
      this.calculTotale();
      this.calculTotalOre();
      this.calculBonuriDeMasa();
      this.editVisible = !this.editVisible;
      this.editVisible = !this.editVisible;
    },
    modificareZileMultiple(val) {
      this.nrZileSelectate.forEach((nrZiSelectata, index) => {
        this.listaZile[nrZiSelectata] = { ...val };
        this.listaZile[nrZiSelectata].DATA_PONTAJ = this.zileSelectate[index];
        if (this.listaZile[nrZiSelectata].ORA_I === "T" || this.listaZile[nrZiSelectata].ORA_I === "CC12" || this.listaZile[nrZiSelectata].ORA_I === "DEL" || this.listaZile[nrZiSelectata].ORA_I === "DFD") {
          var dateParts = this.listaZile[nrZiSelectata].DATA_PONTAJ.split("/");
          var dateObject = new Date(
            +dateParts[2],
            dateParts[1] - 1,
            +dateParts[0]
          );
          if (dateObject.getDay() !== 5) this.listaZile[nrZiSelectata].PONTAT_REAL = "8:30";
          else {
            this.listaZile[nrZiSelectata].PONTAT_REAL = "6:00";
          }
        }
      });
      this.selectareM = false;
      this.nrZileSelectate = [];
      this.zileSelectate = [];
      this.calculTotale();
      this.calculBonuriDeMasa();
      this.calculTotalOre();
      this.editVisible = !this.editVisible;
      this.editVisible = !this.editVisible;
    },
    real(day) {
      if (
        !this.listaZile[day].PONTAT_REAL ||
        this.listaZile[day].PONTAT_REAL === "null"
      )
        return "????";
      if (this.listaZile[day].PONTAT_REAL !== "9:59")
        return this.listaZile[day].PONTAT_REAL;
      return "10+";
    },
    oraI(day) {
      if (
        this.listaZile &&
        this.listaZile[day] &&
        this.listaZile[day].ORA_I &&
        this.listaZile[day].ORA_I !== "null"
      )
        return this.listaZile[day].ORA_I;
      return "????";
    },
    oraE(day) {
      if (
        this.listaZile &&
        this.listaZile[day] &&
        this.listaZile[day].ORA_E &&
        this.listaZile[day].ORA_E !== "null"
      )
        return this.listaZile[day].ORA_E;
      return "????";
    },
    salveaza() {
      let payload = this.listaZile;
      this.selectareM = false;
      if (this.isSuperAdmin) {
        return axios
          .put(
            `//${ipServer}:3000/api/calendarAngajatSuper/${this.selectedUser.ID_SALARIAT}`,
            payload
          )
          .then(() => {
            this.editVisible = !this.editVisible;
          });
      }
      return axios
        .put(
          `//${ipServer}:3000/api/calendarAngajat/${this.selectedUser.ID_SALARIAT}`,
          payload
        )
        .then(() => {
          this.editVisible = !this.editVisible;
        });
    },
    formatareDataDinBD(dataBD) {
      if (dataBD) {
        let current_datetime = dataBD.toString().split("-");
        current_datetime[2] = current_datetime[2].substring(0, 2);
        return (
          current_datetime[2] +
          "/" +
          current_datetime[1] +
          "/" +
          current_datetime[0]
        );
      }
      return null;
    },
    init() {
      axios.get(`//${ipServer}:3000/api/departamente`).then(response => {
        this.listaDepartamente = response.data;
        this.departament = this.listaDepartamente[0];
      });
    },
    anulare() {
      this.listaZile = null;
      this.ziSelectata = null;
      this.selectareM = false;
      this.listaZile = JSON.parse(JSON.stringify(this.copieListaZile));
      this.calculTotale();
      this.calculBonuriDeMasa();
      this.calculTotalOre();
      this.$refs.calendar.updateTimes();
      this.toggleEditVisible();
    },
    anulareSM() {
      this.selectareM = false;
      this.nrZileSelectate = [];
      this.zileSelectate = [];
    },
    toggleDialogEditare() {
      this.dialog = !this.dialog;
    },
    toggleDialogEditareMultipla() {
      this.dialogMultipla = !this.dialogMultipla;
    },
    getSarbatori() {
      axios.get(`//${ipServer}:3000/api/sarbatori`).then((res) => {
        res.data.forEach((element, index) => {
          this.dateSarbatori[index] = element.DATA.substring(0,10);
        });
      });
    },
    calculTotale() {
      (this.totale = {
        AM: 0,
        SIND: 0,
        CM: 0,
        CO: 0,
        COR: 0,
        SUSP: 0,
        CC12: 0,
        T: 0,
        DFD: 0,
        DET: 0,
        DEL: 0,
        NEM: 0,
        IFP: 0,
        PRD: 0,
        REC: 0,
        CCM: 0
      }),
        Object.entries(this.listaZile).forEach(([key, val]) => {
          if (
            key &&
            val.ORA_I &&
            (CODURI_CONCEDIU.includes(val.ORA_I) || val.ORA_I === "NEM")
          ) {
            if (this.totale[val.ORA_I] > 0) {
              this.totale[val.ORA_I]++;
            } else {
              this.totale[val.ORA_I] = 1;
            }
          }
        });
    },
    calculTotalOre() {
      let total = "00:00";
      if (this.listaZile) {
        Object.entries(this.listaZile).forEach(([key, val]) => {
          if (
            (!CODURI_CONCEDIU.includes(val.ORA_I) || val.ORA_I === "T" || val.ORA_I === "CC12" || val.ORA_I === "DFD" || val.ORA_I === "DEL") &&
            val.ORA_I !== "NEM"
          ) {
            if (val.PONTAT_REAL === "10+") val.PONTAT_REAL = "10+";
            if (
              !val.PONTAT_REAL ||
              val.PONTAT_REAL === "null" ||
              val.PONTAT_REAL === "0:00"
            ) {
              val.PONTAT_REAL = "0:00";
            }
            if (key && val.PONTAT_REAL && val.PONTAT_REAL !== "10+") {
              var splitTime1 = val.PONTAT_REAL.split(":");
              if (val.PONTAT_REAL === "10+") {
                splitTime1 = "10:00".split(":");
              }
              var splitTime2 = total.split(":");
              let hour = parseInt(splitTime1[0]) + parseInt(splitTime2[0]);
              let minute = parseInt(splitTime1[1]) + parseInt(splitTime2[1]);
              hour = parseInt(hour + minute / 60);
              minute = parseInt(minute % 60);
              total = hour + ":" + minute;
            }
          }
        });
      }
      let splitTotal = total.split(":");
      this.totalOrePontate = splitTotal[0] + " h, " + splitTotal[1] + " m";
    },
    calculBonuriDeMasa() {
      let bonuri = 0;
      if (this.listaZile) {
        Object.entries(this.listaZile).forEach(([key, val]) => {
          if (key && (val.TIP === TIP_ZI.LUCRATA || val.ORA_I === "T" || val.ORA_I === "DFD")) {
            bonuri++;
          }
        });
      }
      this.bonuri = bonuri;
    },
    hasData(weekday) {
      return weekday !== 0 && weekday !== 6;
    },
    formatareDataRequest(data) {
      let current_datetime = data.toString().split("-");
      return current_datetime[1] + "-" + current_datetime[0];
    },
    modificareZi(val) {
      if (val[0].ORA_I === "T" || val[0].ORA_I === "CC12" || val[0].ORA_I === "DEL" || val[0].ORA_I === "DFD") {
        var dateParts = val[0].DATA_PONTAJ.split("/");
        var dateObject = new Date(
          +dateParts[2],
          dateParts[1] - 1,
          +dateParts[0]
        );
        if (dateObject.getDay() !== 5) val[0].PONTAT_REAL = "8:30";
        else {
          val[0].PONTAT_REAL = "6:00";
        }
      }
      if (val[0].TIP === this.TIP_ZI.ABS_MOTIVATA) {
        this.lastPick = val[0].ORA_I;
      } else {
        this.lastPick = "";
      }
      this.listaZile[val[1]] = val[0];
      this.calculTotale();
      this.calculBonuriDeMasa();
      this.calculTotalOre();
      this.editVisible = !this.editVisible;
      this.editVisible = !this.editVisible;
    },
    setDataCalendar() {
      this.editVisible = true;
      this.showLoading = true;
      this.selectareM = false;
      if (this.isAdmin() || this.isSuperAdmin) {
        axios
          .get(
            `//${ipServer}:3000/api/calendarAngajat/${
              this.selectedUser.ID_SALARIAT
            }/${this.formatareDataRequest(this.date)}`
          )
          .then(response => {
            this.listaZile = {};
            response.data.forEach(zi => {
              let nrZi = parseInt(zi.DATA_PONTAJ.substring(0, 2));
              this.listaZile[nrZi] = zi;
              if (CODURI_CONCEDIU.includes(zi.ORA_I)) {
                this.listaZile[nrZi].TIP = TIP_ZI.ABS_MOTIVATA;
              } else if (zi.ORA_I === "NEM") {
                this.listaZile[nrZi].TIP = TIP_ZI.ABS_NEMOTIVATA;
              } else {
                this.listaZile[nrZi].TIP = TIP_ZI.LUCRATA;
              }
            });

            this.editVisible = !this.editVisible;
            this.editVisible = !this.editVisible;
            this.calculTotale();
            this.calculBonuriDeMasa();
            this.calculTotalOre();
            this.showLoading = false;
          });
      } else {
        axios
          .get(
            `//${ipServer}:3000/api/calendarAngajatConfirmat/${
              this.selectedUser.ID_SALARIAT
            }/${this.formatareDataRequest(this.date)}`
          )
          .then(response => {
            this.listaZile = {};
            response.data.forEach(zi => {
              let nrZi = parseInt(zi.DATA_PONTAJ.substring(0, 2));
              this.listaZile[nrZi] = zi;
              if (CODURI_CONCEDIU.includes(zi.ORA_I)) {
                this.listaZile[nrZi].TIP = TIP_ZI.ABS_MOTIVATA;
              } else if (zi.ORA_I === "NEM") {
                this.listaZile[nrZi].TIP = TIP_ZI.ABS_NEMOTIVATA;
              } else {
                this.listaZile[nrZi].TIP = TIP_ZI.LUCRATA;
              }
            });
            this.calculTotale();
            this.calculBonuriDeMasa();
            this.calculTotalOre();
            this.editVisible = !this.editVisible;
            this.editVisible = !this.editVisible;
            this.showLoading = false;
          });
      }
    },
    getMonth(date) {
      if (date) {
        let month = date.split("-")[1];
        if (month.charAt(0) === "0") {
          return month.charAt(1);
        } else {
          return month;
        }
      }
    },
    editareZi(day, month, year) {
      if (
        !this.editVisible &&
        (!this.listaZile[day] ||
          this.listaZile[day].TIP !== TIP_ZI.LUCRATA ||
          this.isSuperAdmin)
      ) {
        if (this.listaZile[day]) {
          this.ziSelectata = this.listaZile[day];
        } else {
          let dataPontaj;
          if (day < 10) {
            dataPontaj =
              "0" +
              day.toString() +
              "/" +
              month.toString() +
              "/" +
              year.toString();
          } else {
            dataPontaj =
              day.toString() + "/" + month.toString() + "/" + year.toString();
          }
          if (!this.selectareM) {
            this.ziSelectata = {
              ID_PONTAJ: null,
              DATA_PONTAJ: dataPontaj,
              PONTAT_REAL: "",
              TIP: "ABS_MOTIVATA",
              ORA_I: this.lastPick,
              ORA_E: ""
            };
          } else {
            if (!this.nrZileSelectate.includes(day)) {
              this.zileSelectate.push(dataPontaj);
              this.nrZileSelectate.push(day);
            } else {
              this.nrZileSelectate.splice(this.nrZileSelectate.indexOf(day), 1);
              this.zileSelectate.splice(
                this.zileSelectate.indexOf(dataPontaj),
                1
              );
            }
            console.log(this.nrZileSelectate);
          }
        }
        if (!this.selectareM) {
          this.nrZiSelectata = day;
          this.dialog = true;
        }
      }
    }
  },
  watch: {
    date() {
      this.calendarDate = this.date + "-1";
          this.getSarbatori();
      this.setDataCalendar();
    },
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
    },
    departament() {
      if (
        this.departament &&
        this.departament.ID_N_DEPART &&
        this.locatie &&
        this.locatie.ID_N_LOCATIE &&
        this.departament.NUME_DEPART !== "TOATE"
      ) {
        axios
          .get(
            `//${ipServer}:3000/api/departamente/${this.locatie.ID_N_LOCATIE}/${this.departament.ID_N_DEPART}`
          )
          .then(response => {
            this.listaAngajati = response.data;
            this.selectedUser = this.listaAngajati[0];
          });
      } else {
        if (this.departament && this.locatie && this.locatie.ID_N_LOCATIE) {
          axios
            .get(`//${ipServer}:3000/api/locatii/${this.locatie.ID_N_LOCATIE}`)
            .then(response => {
              this.listaAngajati = response.data;
              this.selectedUser = this.listaAngajati[0];
            });
        }
      }
    },
    selectedUser() {
      axios
        .get(
          `//${ipServer}:3000/api/angajatipublic/${this.selectedUser.ID_SALARIAT}`
        )
        .then(response => {
          this.setDataCalendar();
          this.marca = response.data.MARCA;
          this.dataAngajare = this.formatareDataDinBD(
            response.data.DATA_ANGAJARE
          );
          this.dataPlecare = this.formatareDataDinBD(
            response.data.DATA_PLECARE
          );
          this.codCartela = response.data.COD_CARTELA;
        });
    }
  },
  mounted() {
    this.getSarbatori();
    this.calendarDate = this.date + "-1";
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
    this.init();
  }
};
</script>
