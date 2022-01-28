<template>
    <v-card :width="windowWidth-50">
    <highcharts class="hc" :options="chartOptions"></highcharts>
    </v-card>
</template>

<script>

    export default {
        props: {
            challengeData: null,
            filtered: null,
        },

        data() {
            return {
                email: null,
                chartTitle: null,
                windowWidth: window.innerWidth,
                acvtiveHelpingHearts: this.challengeData.filter ((challenge) => challenge.status === 'Incomplete' && challenge.typeName === 'Helping Heart').length,
                acvtiveHealthHearts: this.challengeData.filter ((challenge) => challenge.status === 'Incomplete' && challenge.typeName === 'Health Heart').length,
                acvtiveHolyHearts: this.challengeData.filter ((challenge) => challenge.status === 'Incomplete' && challenge.typeName === 'Holy Heart').length,

                completeHelpingHearts: this.challengeData.filter ((challenge) => challenge.status === 'Complete' && challenge.typeName === 'Helping Heart').length,
                completeHealthHearts: this.challengeData.filter ((challenge) => challenge.status === 'Complete' && challenge.typeName === 'Health Heart').length,
                completeHolyHearts: this.challengeData.filter ((challenge) => challenge.status === 'Complete' && challenge.typeName === 'Holy Heart').length,
            }
        },

        computed: {
            chartOptions: function(){
                
                const result ={
                    chart: {
                        type: 'column',
                    },
                    title: {
                        text: 'Heart Chart'
                    },
                    subtitle: {
                        text: this.chartTitle
                    },
                    xAxis: {
                        categories: [
                            'Active',
                            'Completed',
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total Challenges'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:14px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: 'Health',
                        data: [this.acvtiveHealthHearts, this.completeHealthHearts],
                        color: this.$vuetify.theme.themes.dark.accent
                    }, {
                        name: 'Helping',
                        data: [this.acvtiveHelpingHearts, this.completeHelpingHearts],
                        color: this.$vuetify.theme.themes.dark.primary
                    }, {
                        name: 'Holy',
                        data: [this.acvtiveHolyHearts, this.completeHolyHearts],
                        color: this.$vuetify.theme.themes.dark.secondary
                    }],
                    legend: {
                        backgroundColor: null
                    }
                }
                return result
            }
        },

        mounted() {
            this.$nextTick(() => {
                window.addEventListener('resize', this.onResize);
            })

            if (localStorage.email) {
                this.email = localStorage.email;
            }

            if (this.filtered){
                    this.chartTitle = 'Challenges for: ' + localStorage.email
                }
                else{
                    this.chartTitle = 'Everyone\'s Challenges'
                }
        },

        beforeDestroy() { 
            window.removeEventListener('resize', this.onResize); 
        },

        methods: {  
            onResize() {
                this.windowWidth = window.innerWidth
            }
        }
    }
</script>