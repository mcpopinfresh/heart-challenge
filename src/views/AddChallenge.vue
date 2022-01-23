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
                <v-textarea
                    label="Challenge" 
                    v-model="activity"
                    outlined
                    clearable
                    prepend-icon="mdi-heart-flash"
                    height="300"
                />
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn @click="addRow()" color="accent">Add Challenge</v-btn>
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
				city: '',
				activity: '',
				showMsg : false,
				message: '',
			}
		},
		methods: {
			async addRow() {
				const newRow = {
					name: this.name,
					city: this.city,
					activity: this.activity,
				}
				const doc = new GoogleSpreadsheet(GSheetID);
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 
				const sheet = doc.sheetsByIndex[0];
				await sheet.addRow(newRow);
				
				this.name = '';
				this.city = '';
				this.activity = '';
				this.message = "New row added !";
				this.showMsg = true;
				
			}
		}
	}
</script>