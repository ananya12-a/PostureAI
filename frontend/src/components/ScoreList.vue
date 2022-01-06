<template>
    <md-list>
        <md-subheader> Average Score: {{averageScore}} </md-subheader>
        <md-list-item v-for="feedback in feedbackList" v-bind:key="feedback.attr" :style="getColor(feedback)">
            <md-icon v-if="feedback.score <= 65 && feedback.score > 30" :style="getColor(feedback)">warning</md-icon>
            <md-icon v-else-if="feedback.score > 65" :style="getColor(feedback)">check</md-icon>
            <md-icon v-else :style="getColor(feedback)" >error</md-icon>
            <span class="md-list-item-text" :style="getColor(feedback)"><strong>{{feedback.attr}}:</strong> {{feedback.feedback}}</span>
            <md-tooltip md-direction="left"> <strong> Score:</strong> {{feedback.score}} </md-tooltip>
        </md-list-item>
    </md-list>
</template>

<script>
export default {
    props:{
        feedbackList: [],
        averageScore: Number,
    },
    methods:{
        getColor(feedback) {
                if (feedback.score <= 65 && feedback.score > 30) {
                    return `
                        background-color: #F4B02A;
                        color: white;`;
                }
                else if (feedback.score > 65) {
                    return `
                        background-color: #62C370;
                        color: white;`;
                }
                else return `
                        background-color: #FE654F;
                        color: white;`;
                
            }
    },
    data: function() {
            return {
            }
        },
}
</script>

<style scope>
</style>