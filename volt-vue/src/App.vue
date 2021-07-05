<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="navbardiv">
      <Navbar PageTitle="Page Title" /> 
    </div>
    <div class="belownav">
      <div id="app">
        <VideoElementViewer videoSrc="@/assets/squatSide.mp4" />
      </div>
      <div class="sidebardiv">
        <sidebar class="sidebar"/>
      </div>
    </div>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import VideoElementViewer from "./components/VideoElementViewer.vue";
import Navbar from './components/Navbar.vue'
import sidebar from './components/sidebar.vue'

export default {
  name: "App",
  components: {
    VideoElementViewer,
    Navbar,
    sidebar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 80%;
  position: absolute;
  right:0;
  height: 80%;
}
.icons {
  width: 6%;
  height: auto;
  padding-right: 10px;
  color: white !important;
}
.sidebardiv{
  width:20%;
  position: absolute;
  left:0;
}
.navbardiv{
  background-color:lightyellow;
  top: 0;
  left:0;
  height: 10%;
}
.belownav{
  height: 90%;
}
</style>
