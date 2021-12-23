<template>
    <div class="container">
        <div class="main_canvas"/>
    </div>
</template>

<style scoped>
.container {
    height: 100%;
}
.main_canvas {
    height: 100%;
}
</style>

<script>
import Chartist from "chartist";
import ctAxisTitle from "chartist-plugin-axistitle";
export default {
    name: "ChartComponent",
    props: {
        yvals: Array,
    },
    data: () => {
        return {

        }
    },
    mounted(){
        this.updateGraph();
    },
    methods: {
        updateGraph() {  
            let xvals = [];
            for(let i = 0; i < this.yvals.length; i++) {
                xvals[i] = i;
            }
            console.log("Chart");
            // eslint-disable-next-line no-unused-vars
            var chart = new Chartist.Line('.main_canvas', {
                labels: xvals,
                series: [
                    this.yvals,
                ],
            }, {
                // Remove this configuration to see that chart rendered with cardinal spline interpolation
                // Sometimes, on large jumps in data values, it's better to use simple smoothing.
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2
                }),
                fullWidth: true,
                chartPadding: {
                    bottom: 30,
                },
                low: 0,              
                plugins: [
                    ctAxisTitle({
                    axisX: {
                        axisTitle: 'Frame',
                        axisClass: 'ct-axis-title',
                        offset: {
                            x: 0,
                            y: 50
                        },
                        textAnchor: 'middle'
                    },
                    axisY: {
                        axisTitle: 'Score',
                        axisClass: 'ct-axis-title-y',
                        textAnchor: 'middle',
                        flipTitle: false,
                    }
                    })
                ]
            });
        }
    },
}
</script>