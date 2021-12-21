<template>
    <div class="card">
        <div class="row row70">
            <div class="column col70">
                <video  controlsList="nodownload nofullscreen noremoteplayback" :id="id" :key="videoSrc">
                    <source src="@/assets/squatSide.mp4" type="video/mp4"/>
                </video>
            </div>
            <div class="column col30">
                <canvas :id="`graph-${id}`"/>
            </div>
        </div>

        <div class="row row30">
            <div class="column col70">
                <p>Feedback</p>
                <input type="button" @click="loadFeedback" value ="Load Feedback For Frame" /> 
                <p> {{feedbackList}} </p>
                <p> {{results}} </p>
            </div>
            <div class="column col30 controls">
                <a @click="prevFrame" class="previous round a_button"><i class="fas fa-backward circle-icon"/></a>
                <a @click="nextFrame" class="next round a_button"><i class="fas fa-forward circle-icon"/></a>
                <br>
                <p id="annotation_label">Annotations: </p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
//import {Pose, POSE_CONNECTIONS} from "@mediapipe/pose";
    export default {
        props: {
            videoSrc : String,
        },
        data: function() {
            return {
                feedbackList: [],
                results: [],
                pose: 0,
                id: 1,
                active: false
            }
        },
        created: function() {
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
                console.log(result)
                this.feedbackList = this.results === result
                
                // eslint-disable-next-line no-undef
                this.results = {landmarks: result.poseLandmarks, POSE_CONNECTIONS: POSE_CONNECTIONS, pc_length: POSE_CONNECTIONS.length, l_length: result.poseLandmarks.length}
                // call mff and get analysable results
                // update plot
                //make a new file, called plot.js, functions each take in a result object, and return plotly graph
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
            nextFrame: function() {
                //if (!this.active) return;
                let video = document.getElementById(this.id)
                video.currentTime += 1/8
                this.pose.send({image: video})
            },
            prevFrame: function() {
                //if (!this.active) return;
                let video = document.getElementById(this.id)
                video.currentTime -= 1/8
                this.pose.send({image: video})
            },
        },
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

.circle-icon:hover {
  background-color: #ddd;
  color: black;
}
.circle-icon {
    background: #f1f1f1;
    padding:4%;
    border-radius: 50%;
    margin: 1%;
}

.round {
  border-radius: 50%;
}

.controls{
    text-align:center;
}

.row70> .col70 > video {
    max-height: 100%;
    max-width: 100%;
    border-radius: 16px 0 0 0;
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
.card {
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
}
</style>