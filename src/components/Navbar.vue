<template>
    <div style="display: block;" id="container">
        
        <div class="nav" style="width: 20%">
            <img src="@/assets/logo.png"/>
        </div>
        <div class="nav" style="width: 50%; text-align: center">
            <h1>{{PageTitle}}</h1>
        </div>
        <div class="nav" style="width:30%">
            <i class="fas fa-user"/>
            <p style="display:inline">Name</p>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            PageTitle: String,
        }
    }
</script>

<style scoped>
.nav{
    float:left;
    height:100%;
}
.nav>img{
    height:100%;
    width:auto;
}
#container{
    height: 200px;
    line-height: 200px;
}
.fas{
    padding-right: 10px;
    font-size:150%;
}
</style>