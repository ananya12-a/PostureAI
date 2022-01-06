<template>
    <div>
        <video  controlsList="nodownload nofullscreen noremoteplayback" :id="id" :key="videoSrc" class="hidden" ref="video_source">
                <source src="@/assets/squatSide.mp4" type="video/mp4"/>
        </video>
        <canvas width="1280px" height="720px" ref="output_canvas"></canvas>
    </div>
</template>

<script>
export default {
    props: {
        videoSrc : String,
    },
}
</script>

<style scope>

.hidden {
    height: 0;
}
</style>