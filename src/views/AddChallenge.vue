<template>
	<v-card
        class="mx-auto"
        max-width="500"
    >
        <v-card-title>
            <h2>Add Your Challenge</h2>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field 
                    label="Name" 
                    v-model="name"
                    outlined
                    clearable
                    prepend-icon="mdi-mother-heart"
                />
                <v-select
                    :items="types"
                    v-model="type"
                    return-object
                    item-text="name"
                    label="Challenge Type"
                    outlined
                    prepend-icon="mdi-heart-flash"
                ></v-select>
                <v-textarea
                    label="Challenge Details" 
                    v-model="activity"
                    outlined
                    clearable
                    prepend-icon="mdi-folder-heart"
                    height="200"
                />
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn :disabled="disableBtn" @click="addRow()" color="accent">
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
				name: '',
				activity: '',
                type:{name:'',color:''},
                types: [
                    {name:'Helping Heart', color:'primary'}, 
                    {name:'Health Heart', color:'accent'},
                    {name:'Holy Heart', color:'secondary'}
                ],
                disableBtn: false
			}
		},
		methods: {
			async addRow() {
                this.disableBtn = true;
				const newRow = {
					name: this.name,
					activity: this.activity,
                    typeName: this.type.name,
                    typeColor: this.type.color,
                    status:'Incomplete',
                    addTime: Date.now(),
                    id: this.name + Date.now().toString()
				}
				const doc = new GoogleSpreadsheet(GSheetID);
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 
				const sheet = doc.sheetsByIndex[0];
                await sheet.addRow(newRow);
				
				this.name = '';
				this.activity = '';
                this.type = {name:'',color:''};
                this.disableBtn = false;
			}
		}
	}
</script>