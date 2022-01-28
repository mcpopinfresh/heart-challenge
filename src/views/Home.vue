<template>

  <v-container  class="mt-0 pa-0">
    <v-speed-dial
      fab
      bottom
      right
      fixed
      direction="left"
      transition="slide-x-reverse-transition"
      elevation="30"
    >
      <template v-slot:activator>
        <v-btn
          color="purple darken-2"
          fab
          large
        >
          <v-icon x-large >mdi-heart-settings</v-icon>
        </v-btn>
      </template>
      <v-btn
        @click="showOverlay('add')"
        color="pink darken-2"
        fab
        elevation="30"
      >
        <v-icon  >mdi-heart-plus</v-icon>
      </v-btn>

      <v-btn
        @click="toggleChart()"
        color="cyan darken-2"
        fab
        elevation="30"
      >
        <v-icon  >mdi-heart-pulse</v-icon>
      </v-btn>
    </v-speed-dial>
    
    <v-btn
      @click="toggleFilter()"
      color="info"
      fab
      bottom
      left
      fixed
      elevation="30"
    >
      <v-icon v-if="filterChallenges" >mdi-filter-off</v-icon>
      <v-icon v-else >mdi-account-heart</v-icon>
    </v-btn>

    <challenges :rows="rows" @controlClick="showOverlay($event)"/>

    <v-overlay
      :value="overlay"
      opacity=".5"
    >
      <input-form
        :emailInput="email"
        :nameInput="name"
        :typeInput="type"
        :activityInput="activity"
        :emailList="emails"
        :clickedControl="clickedControl"
        :clickedControlEmail="clickedControlEmail"
        @submitForm="submitEvent($event)"
        @cancelForm="closeOverlay()"
      />
    </v-overlay>

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <v-overlay 
      :value="showChart" 
      @click="showChart=!showChart"
      opacity=".5"
    >
        <heart-chart v-if="showChart" :challengeData="rows" :filtered="filterChallenges"/>
    </v-overlay>
    
  </v-container>

</template>

<script>
  import Challenges from '../components/Challenges.vue'
  import InputForm from '../components/InputForm.vue'
  import HeartChart from '../components/HeartChart.vue'
  import { GSheetID } from '../components/global-vars.js'
  const { GoogleSpreadsheet } = require('google-spreadsheet');
  const creds = require('@/client_secret.json');

  export default {
    name: 'Home',

    components:{
      Challenges,
      InputForm,
      HeartChart,
    },

		created() {
			this.accessSpreadSheet();
		},
    
    data() {
      return{
        sheet: null,
        rawRows: [],
        filterChallenges: false,
        overlay: false,
        clickedRow: null,

        clickedControl: null,
        clickedControlEmail: null,
        email: null,
        activity: null,
        type: null,
        name: null,

        loading: false,
        showChart: false,
        windowWidth: window.innerWidth,
      }
    },

    methods: {
      async accessSpreadSheet() {
        this.loading = true
				const doc = new GoogleSpreadsheet(GSheetID);
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 
				const sheet = doc.sheetsByIndex[0];
				const  rows = await sheet.getRows({
					offset: 0
				})
        this.rawRows = rows
        this.sheet = sheet
        this.loading = false
			},
      async addRow() {
				const newRow = {
					name: this.name,
          email: this.email,
					activity: this.activity,
          typeName: this.type.name,
          typeColor: this.type.color,
          status:'Incomplete',
          addTime: new Date(),
          updateTime: new Date(),
          id: this.email + '|' + Date.now().toString()
				}
				
        await this.sheet.addRow(newRow);
			},
      async updateRow(row){
          row.updateTime = new Date()
          await row.save()
      },
      async deleteRow(row){
        await row.delete()
      },
      showOverlay(e){
        if(e==='add' || e === 'filter'){
          this.clickedControl = e
          this.overlay = true
          return;
        }
        this.clickedRow = e.row
        this.clickedControl = e.controlType
        this.clickedControlEmail = e.row.email
        this.activity = e.row.activity
        this.name = e.row.name
        this.type = {name: e.row.typeName, color: e.row.typeColor}
        this.overlay = true
      },
      submitEvent(e){
        this.email = e.email
        this.name = e.name
        this.type = e.type
        this.activity = e.activity
        
        if(e.formType==='add'){
          this.addRow()

          localStorage.name = this.name
          localStorage.email = this.email
        }
        else if(e.formType==='filter'){
          localStorage.email = this.email
          this.filterChallenges = true
          this.closeOverlay()
          return
        }
        else if(e.formType==='complete'){
          this.clickedRow.status = 'Complete'
          this.updateRow(this.clickedRow)

          localStorage.email = this.email
        }
        else if(e.formType==='edit'){
          this.clickedRow.name = this.name
          this.clickedRow.activity = this.activity
          this.clickedRow.typeName = this.type.name
          this.clickedRow.typeColor = this.type.color
          this.updateRow(this.clickedRow)

          localStorage.email = this.email;
          localStorage.name = this.name;
        }
        else if(e.formType==='delete'){
          this.deleteRow(this.clickedRow)

          localStorage.email = this.email;
        }

        this.accessSpreadSheet() //re-pull data
        this.closeOverlay()
      },
      closeOverlay(){
        this.email = null
        this.name = null
        this.type = null
        this.activity = null
        this.clickedControl = null
        this.clickedControlEmail = null
        this.overlay = false
      },
      toggleFilter(){
        if(this.filterChallenges){
          this.filterChallenges = false
          this.accessSpreadSheet()
        }
        else{
            this.showOverlay('filter')        
        }
      },
      async toggleChart(){
        await this.accessSpreadSheet()
        this.showChart = true
        
      }
    },

    computed: {
      rows: function(){
        if(this.rawRows != []){
          const rows = this.rawRows
          rows.sort(function(a,b){
              return new Date(b.addTime) - new Date(a.addTime);
          });

          if(this.filterChallenges){
            return rows.filter ((row) => row.email.toLowerCase() === localStorage.email.toLowerCase())
          }
          else{
            return rows
          }
        }
        else{
          return []
        }
        
      },
      emails: function(){
          const rows = this.rawRows
          const emails = Array.from(new Set(rows.map((item) => item.email.toLowerCase())))
          return emails
        }
    },

  }
    
</script>

