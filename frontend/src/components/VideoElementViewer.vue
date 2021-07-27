<template>
    <div class="card">
        <div class="row row70">
            <div class="column col70">
                <video>
                    <source src="@/assets/squatSide.mp4">
                </video> 
            </div>
            <div class="column col30">
                <p>Graphs</p>
            </div>
        </div>
        <div class="row row30">
            <div class="column col70">
                <h5>Feedback</h5>
                <a @click="loadFeedback" > Load Feedback For Frame </a>
                <p> {{feedbackList}} </p>
            </div>
            <div class="column col30">
                <p> controls </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            videoSrc : String,
    
        },
        data: function() {
            return {
                feedbackList: [],
            }
        },
        methods: {
            loadFeedback: function() {
                fetch('http://localhost:3000/config/test-list').then(data => data.json().then(
                    elements2 => this.feedbackList.concat(elements2)
                ))
            },
            debug: () => {
                console.log('clicked')
            }
        },
    }
</script>

<style scoped>
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
}
.card > * {
    overflow: hidden;
}
</style>