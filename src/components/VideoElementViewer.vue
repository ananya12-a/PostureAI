<template>
    <div>
        <div class="top parent">
            <div class="width70">
                <video controls src="@/assets/squatSide.mp4" />
            </div>
            <div class="width30">
                <p>Graphs</p>
            </div>
        </div>
        <div class="bottom parent">
            <p>Frame 7: Good posture</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            videoSrc : String,
        }
    }
</script>

<style scoped>
p{
    text-align: left;
}
.parent{
    width:100%;
}
.width70{
    width: 74.5%;
    float: left;
    max-height: 100%;
}
.width30{
    width: 24.5%;
    float: left;
    overflow: scroll;
    height: 100%;
}
.top{
    height: 74.5%;
    float: left;
}
.bottom{
    max-height:24.5%;
    overflow: scroll;
    float: left;
}
video{
    width: 100% !important;
    height: auto !important;
}
div{
    padding:0.25%;
}
</style>