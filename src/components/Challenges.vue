<template>
    <v-container>
        <v-card 
            v-for="row in rows"
            :key="row.id" 
            :color="row.typeColor"
            max-width="500"
            class="my-4"
            elevation="10"
            outlined
            dark
        >
            <div class="d-flex flex-no-wrap justify-space-between"
                border="10px solid black"
            >
                <div>
                    <v-card-title> {{row.name}} </v-card-title>
                    <v-card-subtitle>{{row.activity}}</v-card-subtitle>
                </div>
                <v-avatar
                    class="ma-3"
                    size="125"
                    tile
                >
                    <!--<v-img :src="item.src"></v-img>-->
                    <v-icon v-if="row.typeName=='Helping Heart'" size="125"> mdi-charity </v-icon>
                    <v-icon v-else-if="row.typeName=='Holy Heart'" size="125"> mdi-heart-plus </v-icon>
                    <v-icon v-else-if="row.typeName=='Health Heart'" size="125"> mdi-heart-pulse </v-icon>
                    <v-icon v-else size="125"> mdi-heart-cog </v-icon>

                </v-avatar>
            </div>
        </v-card>
    </v-container>
</template>
 
<script>

import { GSheetID } from '../components/global-vars.js'
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('@/client_secret.json');
	export default {
		name: 'Challenges',

		props: ['sheet'],
		data() {
			return {
				rows: [],
				loading: true,
			}
		},
		methods:{
			async accessSpreadSheet() {
				const doc = new GoogleSpreadsheet(GSheetID);
				await doc.useServiceAccountAuth(creds);
				await doc.loadInfo(); 
				const sheet = doc.sheetsByIndex[0];
				const  rows = await sheet.getRows({
					offset: 0
				})
				this.rows = rows;
			}
		},
		created() {
			this.accessSpreadSheet();
		}
		
	}
</script>

