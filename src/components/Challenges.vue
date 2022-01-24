<template>
    <v-container>
        <v-card 
            v-for="row in rows"
            :key="row.id" 
            :color="row.typeColor"
            shaped

            class="my-4"
            dark
        >
            <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                    <v-card-title> {{row.name}} </v-card-title>
                    <v-card-subtitle>{{row.activity}}</v-card-subtitle>
                    
                    <v-divider class="mx-4"></v-divider>
                    
                    <v-card-title v-if="row.status==='Complete'" style="font-size:24px">
                        <span> {{row.status}}</span>
                        <v-icon color="yellow darken-2" x-large>mdi-star</v-icon>
                    </v-card-title>
                    <v-card-title v-else style="color:lightgray">{{row.status}}</v-card-title>

                    <v-card-actions>
                        <v-btn v-if="row.status==='Incomplete'">
                            <v-icon>mdi-heart-half-full</v-icon>
                            <span>Mark Complete</span>
                        </v-btn>
                    </v-card-actions>
                </div>
                <v-avatar
                    class="ma-3"
                    size="125"
                    width="100"
                    tile
                >
                    <!--
                    <v-icon v-if="row.typeName=='Helping Heart'" size="125"> mdi-charity </v-icon>
                    <v-icon v-else-if="row.typeName=='Holy Heart'" size="125"> mdi-heart-plus </v-icon>
                    <v-icon v-else-if="row.typeName=='Health Heart'" size="125"> mdi-heart-pulse </v-icon>
                    <v-icon v-else size="125"> mdi-heart-cog </v-icon>
                    -->

                    <v-img v-if="row.typeName=='Helping Heart'" src="../assets/helping-heart-small.png" :height="getBadgeHeight(row.status)" contain
                        :gradient="getGradient(row.status,row.typeColor)"
                    ></v-img>
                    <v-img v-else-if="row.typeName=='Holy Heart'" src="../assets/holy-heart-small.png" :height="getBadgeHeight(row.status)" contain
                        :gradient="getGradient(row.status,row.typeColor)"
                    >
                    </v-img>
                    <v-img v-else-if="row.typeName=='Health Heart'" src="../assets/health-heart-small.png" :height="getBadgeHeight(row.status)" contain
                        :gradient="getGradient(row.status,row.typeColor)"
                    >
                    </v-img>
                    <v-img v-else src="../assets/heart.svg" height="80" contain></v-img>

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
                incompletGradient: '',
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
			},
            getBadgeHeight(status){
                if(status==="Complete"){
                    return 120;
                }
                else{
                    return 80;
                }
            },
            getGradient(status,color){
                if(status==="Complete"){
                    return '';
                }
                else{
                    if(color==="primary"){
                        const rgb=this.hexToRgb(this.$vuetify.theme.themes.light.primary)
                        return `to top right, rgba(${rgb}, 1), rgba(${rgb},0.1)`
                    }
                    else if(color==="secondary"){
                        const rgb=this.hexToRgb(this.$vuetify.theme.themes.light.secondary)
                        return `to top right, rgba(${rgb}, 1), rgba(${rgb},0.1)`
                    }
                    else if(color==="accent"){
                        const rgb=this.hexToRgb(this.$vuetify.theme.themes.light.accent)
                        return `to top right, rgba(${rgb}, 1), rgba(${rgb},0.1)`
                    }else{
                        return 'to top right, rgba(233, 30, 99, 1), rgba(233, 30, 99,0.1)'
                    }
                }

            },
            hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '';
            }
		},
		created() {
			this.accessSpreadSheet();
		}
		
	}
</script>

