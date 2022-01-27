<template>

  <v-container  class="mt-0 pa-0">

    <v-btn
      @click="showOverlay(null)"
      color="pink darken-2"
      bottom
      right
      fixed
      fab
      elevation="30"
    >
      <v-icon x-large >mdi-heart-plus</v-icon>
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
  </v-container>

</template>

<script>
  import Challenges from '../components/Challenges.vue'
  import InputForm from '../components/InputForm.vue'

  import { GSheetID } from '../components/global-vars.js'
  const { GoogleSpreadsheet } = require('google-spreadsheet');
  const creds = require('@/client_secret.json');

  export default {
    name: 'Home',

    components:{
      Challenges,
      InputForm
    },

		created() {
			this.accessSpreadSheet();
		},
    
    data() {
      return{
        sheet: null,
        rows: [],
        overlay: false,
        clickedRow: null,

        clickedControl: null,
        clickedControlEmail: null,
        email: null,
        activity: null,
        type: null,
        name: null,

        loading: false,
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

        this.rows = rows.sort(function(a,b){
            return new Date(b.addTime) - new Date(a.addTime);
        });
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
        if(!e){
          this.clickedControl = 'add'
          this.overlay = true
          return;
        }
        this.clickedRow = e.row
        this.clickedControl = e.controlType
        this.clickedControlEmail = e.row.email
        this.activity = e.row.activity
        this.name = e.row.name
        this.type = {name: e.row.typeName, color: e.row.typeColor}
        if (localStorage.email) {
          this.email = localStorage.email
          this.name = localStorage.name
        }
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
      }
    },

    mounted() {
      if (localStorage.email) {
        this.email = localStorage.email;
      }
      if (localStorage.name) {
        this.name = localStorage.name;
      }
    }
  }
    
</script>

