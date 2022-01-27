<template>
    <v-card
          class="mx-auto"
          
      >
          <v-card-title>{{clickedControl.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}} Challenge</v-card-title>
          
          <v-card-text>
              <v-form 
                onSubmit="return false;" 
                v-model="validForm"
                ref="form"
                >
                  <v-text-field 
                      v-if="this.clickedControl!='add'"
                      ref="email"
                      v-model="email"
                      :rules="[rules.required, rules.email, rules.emailMatch]"
                      label="E-Mail" 
                      required
                      outlined
                      clearable
                      prepend-icon="mdi-folder-heart"
                      dense
                  />
                  <v-text-field 
                      v-else
                      ref="email"
                      v-model="email"
                      :rules="[rules.required, rules.email]"
                      label="E-Mail" 
                      required
                      outlined
                      clearable
                      prepend-icon="mdi-folder-heart"
                      dense
                  />
                  <v-text-field 
                    v-show="clickedControl==='edit' || clickedControl==='add'"
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
                    v-show="clickedControl==='edit' || clickedControl==='add'"
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
                    v-show="clickedControl==='edit' || clickedControl==='add'"
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

          <v-divider></v-divider>
          <v-card-actions>
              <v-btn v-if="clickedControl==='complete'" @click="submitForm(clickedControl)" color="success">
                  <v-icon>mdi-heart</v-icon>
                  <span>Complete Challenge</span>
              </v-btn>
              <v-btn v-else-if="clickedControl==='delete'" @click="submitForm(clickedControl)" color="red">
                  <v-icon>mdi-heart-broken</v-icon>
                  <span>Delete Challenge</span>
              </v-btn>
              <v-btn v-else-if="clickedControl==='edit'" @click="submitForm(clickedControl)" color="accent">
                  <v-icon>mdi-heart-multiple</v-icon>
                  <span> Update Challenge</span>
              </v-btn>
              <v-btn v-else-if="clickedControl==='add'" @click="submitForm(clickedControl)" color="accent">
                  <v-icon>mdi-heart-plus</v-icon>
                  <span> Add Challenge</span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="cancelForm()" color="info" class="ml-4">
                  <v-icon>mdi-heart-off-outline</v-icon>
                  <span>Cancel</span>
                  
              </v-btn>
          </v-card-actions>
      </v-card>
</template>

<script>

export default {
    props: {
        clickedControl: null,
        clickedControlEmail: null,
        emailInput: null,
        nameInput: null,
        typeInput: null,
        activityInput: null,
    },

    data() {
        return{
            email: this.emailInput,
            name: this.nameInput,
            type: this.typeInput,
            activity: this.activityInput,
            validForm: false,
            types: [
                {name:'Helping Heart', color:'primary'}, 
                {name:'Health Heart', color:'accent'},
                {name:'Holy Heart', color:'secondary'}
            ],
            rules: {
                required: value => !!value || 'Required.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
                emailMatch: value =>{
                    if(!value) return true
                    return value.toLowerCase() === this.clickedControlEmail.toLowerCase() || 'E-Mail does not match the stored e-mail for this challenge'
                }
            },
        }
    },

    methods:{
        submitForm(clickedControl){
            this.$refs.form.validate()
            if(!this.validForm) return;

            const result = {formType: clickedControl, email: this.email, name: this.name, type: this.type, activity: this.activity}
            this.$emit('submitForm',result)
        },
        cancelForm(){
            this.$emit('cancelForm')
        },
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
