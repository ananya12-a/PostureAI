<template>
    <div>
        <!--split up into components-->
        <div class="row row70">
            <div class="column col70">
                <video  controlsList="nodownload nofullscreen noremoteplayback" :id="id" :key="videoSrc" class="hidden" ref="video_source">
                    <source src="@/assets/squatSide.mp4" type="video/mp4"/>
                </video>
                <canvas width="1280px" height="720px" ref="output_canvas"></canvas>
            </div>
            <div class="column col30">
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
            </div>
        </div>

        <div class="row row30">
            <div class="column col70">
                <ChartComponent :yvals="frameData" v-bind:key="frameData.length"/>
            </div>
            <div class="column col30 controls">
                    <div class="md-layout md-gutter">
                        <md-field class="md-layout-item">
                            <md-select v-model="excerciseType" id="movie" placeholder="Exercise Name" @click="console.log('change')"> <!--@change change exercise analysis-->
                                <md-optgroup label="Side View">
                                    <md-option v-for="excerciseType in excerciseTypes.side" v-bind:key="excerciseType" :value="excerciseType">{{excerciseType}}</md-option>
                                </md-optgroup>
                                <md-optgroup label="Front View">
                                    <md-option v-for="excerciseType in excerciseTypes.front" v-bind:key="excerciseType" :value="excerciseType">{{excerciseType}}</md-option>
                                </md-optgroup>
                            </md-select>
                        </md-field>
                        <md-switch v-model="annotations" @change="sameFrame" class="annotation-switch md-layout-item">Anotations</md-switch>
                    </div>
                    <div class="md-layout md-gutter second-row">
                        <div class="md-layout-item">
                            <VueSlider v-model="framerate" :min="0" :max="60" :interval="1" class="framerate-slider"/>
                            Framerate: {{framerate}}
                        </div>
                        <div class="md-layout-item">
                            <md-button class="md-icon-button md-raised" @click="prevFrame">
                                <md-icon>fast_rewind</md-icon>
                            </md-button>
                            <md-button class="md-icon-button md-raised" @click="nextFrame">
                                <md-icon>fast_forward</md-icon>
                            </md-button>
                        </div>
                        
                        
                    </div>
                    
            </div>
        </div>
    </div>
</template>

<script>
import ChartComponent from "./ChartComponent.vue";
//import {Pose, POSE_CONNECTIONS} from "@mediapipe/pose";
import engine from "../assets/engine.js";
import lungeAnalyse from "../assets/lungesAnalysis.js";
import squatAnalyse from "../assets/squatAnalysis.js";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
    export default {
        components: {
            ChartComponent,
            VueSlider,
        },
        props: {
            videoSrc : String,
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
                framerate: 24,
                video: {
                    sourceLink: "",
                    component: {},
                    frames: []
                },
                frameData: [],
                currFrame: -1,
            }
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
            loadFeedback: function() {
                //console.log('asdfa')
                //fetch('http://localhost:3000/config/test-list').then(data => data.json().then(
                //    elements2 => this.feedbackList = this.feedbackList.concat(elements2)
                //))
            },
            debug: () => {
                console.log('clicked')
            },
            sameFrame: function() {
                console.log("Same Frame")
                //if (!this.active) return;
                let video = this.$refs.video_source;
                console.log(video.currentTime);
                this.pose.send({image: video})
            },
            nextFrame: function() {
                console.log("Next Frame")
                //if (!this.active) return;
                let video = this.$refs.video_source;
                this.$refs.video_source.framerate = 1;
                if (video.duration <= video.currentTime) return;
                video.currentTime += 1;
                this.pose.send({image: video});
                this.currFrame++;
            },
            prevFrame: function() {
                console.log("Prev Frame")
                //if (!this.active) return;
                let video = this.$refs.video_source;
                this.$refs.video_source.framerate = 1;
                if (0 >= video.currentTime -1) return;
                video.currentTime -= 1;
                this.pose.send({image: video});
                this.currFrame--;
            },
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
        },//#003F91, #1B9AAA, (#0B63C1)
    }
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  vertical-align: middle;
}

.framerate-slider{
    margin-top:15%;
    color:red;
}

.annotation-switch{
    display:inline;
    margin:5% 0%;
}

.md-icon-button{
    margin:5% 15%;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

#annotation_label{
    margin: 5% 3%;
    display:inline-block;
}

.round:hover {
  background-color: #ddd;
  color: black;
}
.round {
    background: #f1f1f1;
    padding:2%;
    border-radius: 50%;
    margin: 2%;
}

.second-row{
    margin-top:5%;
}

.a_button{
    background: #f1f1f1;
}

.controls{
    text-align:center;
}

.row70> .col70 > video {
    max-height: 100%;
    max-width: 100%;
    /*border-radius: 16px 0 0 0;*/
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
/*.card {
    position: relative;
    background: #fff;
    box-shadow: 0 15px 25px rgba(0,0,0,0.25);
    border-radius: 16px 16px 16px 16px;
    justify-content: center;
    align-items: center;
    margin: 5%;
    z-index: 0;
    text-align:left;
}
.card > * {
    overflow: hidden;
}*/

.hidden {
    height: 0;
}

  .md-switch {
    display: flex;
  }


</style>