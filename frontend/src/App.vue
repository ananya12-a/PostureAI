<template>
  <div id="container">
    <mediapipe></mediapipe>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="navbardiv">
      <Navbar PageTitle="Page Title" @expandMenu="expandMenu"/> 
    </div>
    <div id="app" class="belownav">
        <VideoElementViewer videoSrc="@/assets/squatSide.mp4" />
    </div>
    <!--<div class="sidebardiv">
      <transition name="slide-fade">
        <sidebar ref='sidebar' class="sidebar" v-if="isSidebarExpanded"/>
      </transition>
    </div>-->
  
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import VideoElementViewer from "./components/VideoElementViewer.vue";
import Navbar from './components/Navbar.vue'
import mediapipe from './components/mediapipe.vue'
//import sidebar from './components/sidebar.vue'


export default {
  name: "App",
  components: {
    VideoElementViewer,
    Navbar,
    mediapipe,
  },
  data: function() {
    return {
      isSidebarExpanded: false,
    }
  },
  methods: {
    expandMenu: function() {
      console.log('menu')
      document.getElementById("app").addEventListener('click', this.appClick);
      this.isSidebarExpanded = true;
    },
    appClick: function() {
      document.getElementById("app").removeEventListener('click', this.appClick)
      this.isSidebarExpanded = false;
    }
  }
};
</script>

<style>
@font-face {
  font-family: "Montserrat";
  src: local("Montserrat"),
   url(/Users/ananyaaggarwal/Desktop/PostureAI/frontend/fonts/Montserrat/Montserrat-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Playfair Display";
  src: local("Playfair Display"),
   url(/Users/ananyaaggarwal/Desktop/PostureAI/frontend/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf) format("truetype");
}
#app {
  font-family: Montserrat;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: absolute;
  color: #2c3e50;
  top: 3em;
  bottom: 0;
  right: 0;
  left: 0;
}
h1,h2,h3,h4,h5,h6{
  font-family: Playfair Display;
}
p{
  font-family: Montserrat;
}
.icons {
  width: 6%;
  height: auto;
  padding-right: 10px;
  color: white !important;
}
.sidebardiv{
  position: absolute;
  width:20%;
  left: 0;
  top: 3em;
  bottom: 0;
}
.sidebardiv > * {
  position: relative;
  z-index: 1000;
}
.navbardiv{
  margin: 0;
  z-index:1000;
}
.navbardiv > * {
  position: relative;
  z-index: 1000;
}
#container{
  margin: 0;
  height: 100%;
}
body {
  margin: 0;
  height: 100%;
}
html {
  height: 100%;
}
.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 1s;
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(-100%);
}
</style>
