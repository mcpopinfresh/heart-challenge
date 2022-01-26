<template>
<v-card class="ma-0 pa-0">
    <challenges :key="challengesKey" :rows="rows" @controlClick="showOverlay($event)"/>

    <v-overlay
      :value="overlay"
      opacity=".8"

    >
      <v-card
          class="mx-auto"
          
      >
          <v-card-title>{{this.clickedControl.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}} Challenge</v-card-title>
          
          <v-card-text>
            
              <v-form onSubmit="return false;" >
                  <v-text-field 
                      ref="emailEntered"
                      v-model="emailEntered"
                      :rules="[rules.required, rules.email]"
                      label="Enter E-Mail to Confirm Identity" 
                      required
                      outlined
                      clearable
                      prepend-icon="mdi-folder-heart"
                      dense
                  />
                  <v-divider v-show="this.clickedControl==='edit'" class="my-4"></v-divider>
                  <v-text-field 
                    v-show="this.clickedControl==='edit'"
                    ref="name"
                    label="Name" 
                    v-model="name"
                    :rules="[rules.required]"
                    required
                    outlined
                    clearable
                    prepend-icon="mdi-mother-heart"
                    dense
                  />
                  <v-select
                    v-show="this.clickedControl==='edit'"
                    ref="type"
                    :items="types"
                    v-model="type"
                    :rules="[rules.required]"
                    required
                    return-object
                    item-text="name"
                    label="Challenge Type"
                    outlined
                    prepend-icon="mdi-heart-flash"
                    dense
                  ></v-select>
                  <v-textarea
                    v-show="this.clickedControl==='edit'"
                    ref="activity"
                    label="Challenge Details" 
                    v-model="activity"
                    :rules="[rules.required]"
                    required
                    outlined
                    clearable
                    prepend-icon="mdi-heart-outline"
                    height="180"
                  />
              </v-form>
          </v-card-text>
          <v-card-text v-if="showEmailError===true" class="red--text">E-Mail entered did not match the one stored for this challenge</v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
              <v-btn v-if="this.clickedControl==='complete'" @click="completeChallenge()" color="success">
                  <v-icon>mdi-heart</v-icon>
                  <span>Complete Challenge</span>
              </v-btn>
              <v-btn v-else-if="this.clickedControl==='delete'" @click="deleteChallenge()">
                  <v-icon>mdi-heart-broken</v-icon>
                  <span>Delete Challenge</span>
              </v-btn>
              <v-btn v-else-if="this.clickedControl==='edit'" @click="editChallenge()" color="accent">
                  <v-icon>mdi-heart-multiple</v-icon>
                  <span> Update Challenge</span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="resetForm()" color="info" class="ml-4">
                  <v-icon>mdi-heart-off-outline</v-icon>
                  <span>Cancel</span>
                  
              </v-btn>
          </v-card-actions>
      </v-card>
    </v-overlay>
</v-card>
</template>

<script>
  import Challenges from '../components/Challenges.vue'

  import { GSheetID } from '../components/global-vars.js'
  const { GoogleSpreadsheet } = require('google-spreadsheet');
  const creds = require('@/client_secret.json');

  export default {
    name: 'Home',

    components:{
      Challenges,
    },

		created() {
			this.accessSpreadSheet();
		},
    
    data() {
      return{
        rows: [],
        challengesKey: 0,
        overlay: false,
        clickedRow: null,
        clickedControl: '',
        emailEntered: null,
        activity: null,
        type: null,
        name: null,
        types: [
          {name:'Helping Heart', color:'primary'}, 
          {name:'Health Heart', color:'accent'},
          {name:'Holy Heart', color:'secondary'}
        ],
        showEmailError: false,
        formHasErrors: false,
        rules: {
          required: value => !!value || 'Required.',
          email: value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
          },
        },
      }
    },

    methods: {
      async updateRow(row){
          row.updateTime = new Date()
          await row.save()
      },
      async deleteRow(row){
        await row.delete()
      },
			async accessSpreadSheet() {
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
			},
      showOverlay(e){
        this.clickedRow = e.row
        this.clickedControl = e.controlType
        this.activity = e.row.activity
        this.name = e.row.name
        this.type = {name: e.row.typeName, color: e.row.typeColor}
        this.overlay = true
      },
      completeChallenge(){
        this.formHasErrors = false
        this.showEmailError = false

        this.validateForm()
        if(this.formHasErrors) return;

        if(this.clickedRow.email.toLowerCase() === this.emailEntered.toLowerCase()){
          this.clickedRow.status = 'Complete'
          this.updateRow(this.clickedRow)
          this.challengesKey += 1 //forces component to re-render
          this.resetForm()
          this.overlay = false
        }
        else{
          this.showEmailError = true
        }
      },
      editChallenge(){
        this.formHasErrors = false
        this.showEmailError = false

        this.validateForm()
        if(this.formHasErrors) return;

        if(this.clickedRow.email.toLowerCase() === this.emailEntered.toLowerCase()){
          this.clickedRow.name = this.name
          this.clickedRow.activity = this.activity
          this.clickedRow.typeName = this.type.name
          this.clickedRow.typeColor = this.type.color
         
         this.updateRow(this.clickedRow)
          this.challengesKey += 1 //forces component to re-render
          this.resetForm()
          this.overlay = false
        }
        else{
          this.showEmailError = true
        }
      },
      deleteChallenge(){
        this.formHasErrors = false
        this.showEmailError = false

        this.validateForm()
        if(this.formHasErrors) return;

        if(this.clickedRow.email.toLowerCase() === this.emailEntered.toLowerCase()){
          const index = this.rows.indexOf(this.clickedRow)
          this.deleteRow(this.clickedRow)
          this.rows.splice(index,1)
          this.challengesKey += 1 //forces component to re-render
          this.resetForm()
          this.overlay = false
        }
        else{
          this.showEmailError = true
        }
        
      },
      getRow(rowId){
        return this.rows.filter(function (el) {
            return el.id == rowId 
        })[0];  
      },
      validateForm(){
        Object.keys(this.form).forEach(f => {
          if (!this.$refs[f].valid) this.formHasErrors = true
          this.$refs[f].validate(true)
        })
      },
      resetForm () {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
            this.$refs[f].reset()
        })

        this.overlay = false
        this.showEmailError = false
        this.clickedRow = null
        this.clickedControl = ''
      },
    },

    computed: {
          form () {
            return {
                emailEntered: this.emailEntered,
                activity: this.activity,
                type: this.type,
                name: this.name,
            }
          },
        },

  }

    
</script>

