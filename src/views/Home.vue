<template>
<v-card class="ma-0 pa-0">
    <challenges :completeRowID="completeRowID" @completeClick="showCompleteOverlay($event)"/>

    <v-overlay
      :value="overlay"
      opacity=".8"

    >
      <v-card
          class="mx-auto"
          
      >
          <v-card-title>
              Complete Challenge
          </v-card-title>
          
          <v-card-text>
            
              <v-form onSubmit="return false;">
                  <v-text-field 
                      ref="email"
                      v-model="email"
                      :rules="[rules.required, rules.email]"
                      label="Enter E-Mail to Confirm Identity" 
                      required
                      outlined
                      clearable
                      prepend-icon="mdi-folder-heart"
                  />
              </v-form>
          </v-card-text>
          <v-card-text v-if="showEmailError===true" class="red--text">E-Mail entered did not match the one stored for this challenge</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
              <v-btn @click="completeChallenge()" color="success">
                  <v-icon>mdi-heart</v-icon>
                  <span>Complete Challenge</span>
              </v-btn>
              <v-btn @click="resetForm()" color="info">
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

  export default {
    name: 'Home',

    components:{
      Challenges,
    },

    data() {
      return{
        overlay: false,
        completeRowID: null,
        clickedRowID: null,
        email: null,
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
      showCompleteOverlay(e){
        this.overlay = e.showOverlay
        this.clickedRowID = e.rowId
      },
      completeChallenge(){
        this.formHasErrors = false
        this.showEmailError = false

        Object.keys(this.form).forEach(f => {
            if (!this.$refs[f].valid) this.formHasErrors = true
            this.$refs[f].validate(true)
        })
        if(this.formHasErrors) return;
        const rowEmail = this.clickedRowID.split('|')[0]
        if(rowEmail.toLowerCase() === this.email.toLowerCase()){
          this.completeRowID = this.clickedRowID
          this.resetForm()
          this.overlay = false
        }
        else{
          this.showEmailError = true
        }
      },
      resetForm () {
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
            this.$refs[f].reset()
        })

        this.overlay = false
        this.showEmailError = false
        this.clickedRowID = null
      },
    },

    computed: {
          form () {
            return {
                email: this.email,
            }
          },
        },

  }

    
</script>

