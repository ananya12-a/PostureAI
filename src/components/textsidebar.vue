<template>
    <div>
        <!--<p :v-for="text in texts">{{text}}</p>-->
        <p>Dashboard</p>
        <p>Upload</p>
        <p>Schedule</p>
        <p>Profile</p>
        <p>Leaderboard</p>
    </div>
</template>

<script>
    export default {
        props: {

        },
    }
</script>

<style scoped>
p{
    font-size:125%;
    padding: 2%;
}
</style>