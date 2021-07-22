<template>
  <div id="container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="navbardiv">
      <Navbar PageTitle="Page Title" @expandMenu="expandMenu"/> 
    </div>
    <div id="app belownav">
        <VideoElementViewer videoSrc="@/assets/squatSide.mp4" />
    </div>
    <div class="sidebardiv">
        <sidebar ref='sidebar' class="sidebar" v-if="isSidebarExpanded" @closeSidebar="isSidebarExpanded = false" tabindex="0"/>
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
  data: function() {
    return {
      isSidebarExpanded: false,
    }
  },
  methods: {
    expandMenu: function() {
      console.log('menu')
      this.isSidebarExpanded = true;

      // TODO: finish focus handling
      //this.$refs.sidebar.focus();
      console.log(this.$refs.sidebar);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: absolute;
  color: #2c3e50;
  height: 80%;
  top: 3em;
  right: 0;
  left: 0;
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
.navbardiv{
  margin: 0;
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
</style>
