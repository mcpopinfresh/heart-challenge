<template>
	<v-card
        class="mx-auto"
        max-width="500"
    >
        <v-card-title>
            <h2>Add Your Challenge</h2>
        </v-card-title>
        <v-card-text>
            <v-form onSubmit="return false;">
                <v-text-field 
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
                <v-text-field 
                    ref="email"
                    label="E-Mail" 
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    required
                    outlined
                    clearable
                    prepend-icon="mdi-folder-heart"
                    dense
                />
                <v-select
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
            <v-btn :disabled="disableBtn" @click="addChallenge()" color="accent">
                <v-icon>mdi-heart-plus</v-icon>
                <span>Add Challenge</span>
                
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import { GSheetID } from '../components/global-vars.js'
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const creds = require('@/client_secret.json');
	export default {
		name: "AddChallenge",

		data() {
			return {
				name: null,
				activity: null,
                type: null,
                email: null,
                disableBtn: false,
                formHasErrors: false,
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
                },
			}
		},

        computed: {
            form () {
                return {
                    name: this.name,
                    activity: this.activity,
                    type: this.type,
                    email: this.email,
                }
            },
        },


		methods: {
            addChallenge(){
                this.formHasErrors = false

                Object.keys(this.form).forEach(f => {
                    if (!this.$refs[f].valid) this.formHasErrors = true
                    this.$refs[f].validate(true)
                })
                if(this.formHasErrors) return;

                this.disableBtn = true;
                this.addRow();
                this.disableBtn = false;

                this.resetForm();
            },
            resetForm () {
                this.formHasErrors = false

                Object.keys(this.form).forEach(f => {
                    this.$refs[f].reset()
                })
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
                    id: this.email + '|' + Date.now().toString()
				}
				const doc = new GoogleSpreadsheet(GSheetID);
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 
				const sheet = doc.sheetsByIndex[0];
                await sheet.addRow(newRow);
			}
		}
	}
</script>