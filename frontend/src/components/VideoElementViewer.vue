<template>
    <div>
        <div v-if="currentSubID!=''">
            <p>Sub ID:{{currentSubID}}</p>
            <div class="row row70">
                <div class="column col70">
                    <video controlsList="nodownload nofullscreen noremoteplayback" :id="id" v-bind:key="videoSrc" class="hidden" ref="video_source">
                        <source src="@/assets/squatSide.mp4" type="video/mp4"/>
                    </video>
                    <canvas width="1280px" height="720px" ref="output_canvas"></canvas>
                </div>
                <div class="column col30">
                    <scoreList :feedbackList="feedbackList" :averageScore="averageScore"/>
                </div>
            </div>

            <div class="row row30">
                <div class="column col70">
                    <ChartComponent :yvals="frameData" v-bind:key="frameData.length"/>
                </div>
                <div class="column col30 controls">
                    <ControlPanel :excerciseTypes="excerciseTypes" :framerate="framerate" :annotations="annotations" @nextFrame="nextFrame" @prevFrame="prevFrame" @sameFrame="sameFrame" @framerate-update="updateframerate" @exercise-update="updateExcercise"/>
                </div>
            </div>
        </div>
        <div v-else style="text-align:center">
            <md-icon class="md-size-5x">search</md-icon>
            <span class="md-display-3">No exericse selected!</span>
        </div>
    </div>
</template>

<script>
import ChartComponent from "./ChartComponent.vue";
//import videoView from "./videoView.vue";
import ScoreList from "./ScoreList.vue";
import ControlPanel from "./ControlPanel.vue";
//import {Pose, POSE_CONNECTIONS} from "@mediapipe/pose";
import engine from "../assets/engine.js";
import lungeAnalyse from "../assets/lungesAnalysis.js";
import squatAnalyse from "../assets/squatAnalysis.js";
import { mapState } from 'vuex'
    export default {
        components: {
            ChartComponent,
            ScoreList,
            ControlPanel,
        },
        props: {
            //videoSrc : String,
        },
        data: function() {
            return {
                feedbackList: [],
                results: [],
                pose: 0,
                id: 1,
                active: false,
                annotations: false,
                averageScore: 0.0,
                excerciseTypes: {side: ["Lunge (Side)", "Squat (Side)"], front: ["Side Lunge (Front)"]},//["Lunges(Side View)", "Sit ups(Side View)", "Squats(Side View)"],
                excerciseType: "Lunge (Side)",
                view: "Front",
                framerate: 8,
                frameData: [],
                currFrame: -1,
                videoSrc: `../backend/submissions/${this.userID}/${this.currentSubID}`,
            }
        },
        computed:{
            ...mapState('submissions', {
                currentSubID: state => state.currentSubID,
            }),
            ...mapState('account', {
                userID: state => state.userID,
            }),
        },
        created: function() {
            //this.video.sourceLink = "@/assets/squatSide.mp4";
            //this.video.component = videojs(this.video.sourceLink);
            engine.init();
            // eslint-disable-next-line no-undef
            this.pose = new Pose({locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });
            this.pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            //this.pose.onReady(function(){ this.active = true })

            this.pose.onResults(result => {
                this.feedbackList = this.results === result
                
                //eslint-disable-next-line no-undef
                this.results = {
                    keypoints: result.poseLandmarks, 
                    //eslint-disable-next-line no-undef
                    POSE_CONNECTIONS: POSE_CONNECTIONS, 
                    //eslint-disable-next-line no-undef
                    pc_length: POSE_CONNECTIONS.length, 
                    //eslint-disable-next-line no-undef
                    l_length: result.poseLandmarks.length
                    }
                
                engine.update({...this.results});
                //engine.run()
                if (this.excerciseType==='Squat (Side)'){
                    squatAnalyse(engine)
                }
                else if (this.excerciseType==='Lunge (Side)'){
                    lungeAnalyse(engine)
                }
                else{
                    squatAnalyse(engine)
                }

                const output = engine.getOutput();
                this.feedbackList = [];
                this.averageScore = output.averageScore;
                for(let i = 0; i < output.features.length; i++) {
                    this.feedbackList[i] = {
                        attr: output.features[i].attr,
                        feedback: output.features[i].feedback,
                        score: output.features[i].score
                    }
                }

                // update plot
                //make a new file, called plot.js, functions each take in a result object, and return plotly graph

                const canvasElement = this.$refs.output_canvas;
                const canvasCtx = canvasElement.getContext('2d');

                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                // Only overwrite existing pixels.
                canvasCtx.globalCompositeOperation = 'source-in';
                canvasCtx.fillStyle = '#00FF00';
                canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

                // Only overwrite missing pixels.
                canvasCtx.globalCompositeOperation = 'destination-atop';
                canvasCtx.drawImage(
                    result.image, 0, 0, canvasElement.width, canvasElement.height);

                
                this.frameData[this.currFrame] = this.averageScore;
                console.log("Frame Data", this.frameData);

                if (!this.annotations) {
                    canvasCtx.restore();
                    return
                }
                canvasCtx.globalCompositeOperation = 'source-over';
                //eslint-disable-next-line no-undef
                drawConnectors(canvasCtx, result.poseLandmarks, POSE_CONNECTIONS,
                                {color: '#00FF00', lineWidth: 4});
                //eslint-disable-next-line no-undef
                drawLandmarks(canvasCtx, result.poseLandmarks,
                                {color: '#FF0000', lineWidth: 2});
                canvasCtx.restore();

                console.log(this.$refs.video_source.currentTime);
            });
            
        },
        methods: {
            sameFrame: function() {
                console.log("Same Frame")
                //if (!this.active) return;
                let video = this.$refs.video_source;
                console.log(video.currentTime);
                this.pose.send({image: video})
                this.annotations = !this.annotations
            },
            nextFrame: function() {
                console.log("Next Frame")
                //if (!this.active) return;
                let video = this.$refs.video_source;
                if (video.duration <= video.currentTime) return;
                video.currentTime += 1/this.framerate;
                this.pose.send({image: video});
                this.currFrame++;
            },
            prevFrame: function() {
                console.log("Prev Frame")
                //if (!this.active) return;
                let video = this.$refs.video_source;
                if (0 >= video.currentTime -1) return;
                video.currentTime -= 1/this.framerate;
                this.pose.send({image: video});
                this.currFrame--;
            },
            updateframerate: function(rate){
                
                this.framerate = rate
                console.log("Update ", rate)
            },
            updateExcercise: function (new_ex){
                this.excerciseType = new_ex
                console.log("exercise ", new_ex)
            },
        },//#003F91, #1B9AAA, (#0B63C1)
    }
</script>

<style scoped>
.framerate-slider{
    margin-top:15%;
    color:red;
}

.md-icon-button{
    margin:5% 15%;
}

.second-row{
    margin-top:5%;
}

.controls{
    text-align:center;
}

.row70> .col70 > video {
    max-height: 100%;
    max-width: 100%;
}
.row {
  display: flex;
}
.column {
  margin: 0;
}
.col70 {
    flex: 70%;
}
.col30{
    flex: 30%;
    padding: 1%;
}
.row70 {
    height: 70%;
}
.row30{
    height: 30%;
    padding: 1%;
}


.hidden {
    height: 0;
}

</style>