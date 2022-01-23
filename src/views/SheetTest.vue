<template>
	<div class="container-fluid">
		<div class="row">
			<main role="main" class="col-md-12 ml-sm-auto col-lg-12 pt-3 px-4">
				<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 ">
					<h2>VueSheet List</h2>
				</div>
				<div class="table-responsive">
				<table class="table table-striped ">
					<thead>
					<tr>
						<th>Name</th>
						<th>Phone</th>
						<th>Activity</th>
						<th>City</th>
					</tr>
					</thead>
					
					<tbody>
						<Row v-bind:key="row.id" v-for="row in rows" v-bind:row="row" />
					</tbody>
				</table>
				</div>
			</main>
		</div>
	</div>
</template>
 
<script>
import Row from '@/components/Row.vue';
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('@/client_secret.json');
	export default {
		name: "SheetTest",
		components: {
			Row
		},
		props: ["sheet"],
		data() {
			return {
				rows: [],
				loading: true,
			}
		},
		methods:{
			async accessSpreadSheet() {
				const doc = new GoogleSpreadsheet('1hFVSy7FTLIbweePF_yKqB1YbfvxtfNxl8_YW957dFrU');
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

