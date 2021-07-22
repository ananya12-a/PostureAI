<template>
    <div>
        <div class="icondiv">
            <iconsidebar/>
        </div>
        <div class="textdiv">
            <textsidebar/>
        </div>
    </div>
</template>

<script>
import iconsidebar from '@/components/iconsidebar.vue'
import textsidebar from '@/components/textsidebar.vue'
    export default {
        components:{
            iconsidebar,
            textsidebar,
        },
        
    }
</script>

<style scoped>
.icondiv{
    position:absolute;
    left:0;
    width: 30%;
    background-color: lightsalmon;
    padding-top:10px;
}
.textdiv{
    position:absolute;
    right:0;
    width:70%;
    background-color: lightgray;
    border-radius: 0 15px 15px 0;
    margin-top: 13%;
    display:none;
    opacity:0;
}
.icondiv:hover + .textdiv, .textdiv:hover{
    display: block;
    animation-name: appear;
    animation-duration: 1s;
    opacity:100;
}
#app:hover{
    animation-name: appear;
    animation-duration: 1s;
    animation-direction: reverse;
    opacity:0;
    display: none;
}
@keyframes appear{
    from{opacity:0}
    to{opacity:100}
}
</style>