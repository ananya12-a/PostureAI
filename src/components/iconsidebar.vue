<template>
    <div class="container">
        <!--<i v-for="icon in icons" :key="icon.message" :class="fas fa-" + icon/>-->
        <button @click="console.log('clicked')"><i class="fas fa-bars"></i></button>
        <i class="fas fa-desktop"></i>
        <i class="fas fa-upload"></i>
        <i class="fas fa-calendar"></i>
        <i class="fas fa-user"></i>
        <i class="fas fa-list-ol"></i>
        
    </div>
</template>

<script>
    export default {
        props:{
            
        },
        data: function (){
            
        },
        methods:{
            
        }
    }
</script>

<style scoped>
.container{
    padding-left:5%;
}
button{
    background-color:transparent;
    border: none;
    padding:10%;
}
.fas{
    font-size:200%;
    display:block;
    padding: 10%;
}
</style>