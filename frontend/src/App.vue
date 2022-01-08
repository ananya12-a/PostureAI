<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>

          <span class="md-title">{{currentPage}}</span>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini" v-if="isAuth">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="menuVisible = !menuVisible">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item v-for="item in menuItems" v-bind:key="item.pageName" @click="() => updatePage(item.pageName)">
                <md-icon>{{item.pageIcon}}</md-icon>
                <span class="md-list-item-text">{{item.pageName}}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div v-if="isAuth">
          <div v-if="currentPage==='Upload'">
          <upload/>
          </div>
          <div v-if="currentPage==='Profile'">
            <profile :userID="userData.userID" :username="userData.username" :token="userData.token" @subUpdated="currentPage='Dashboard'"/>
          </div>
          <div v-if="currentPage === 'Dashboard'">
          <VideoElementViewer/>
          </div>
        </div>
        <div v-else>
        <!-- isAuth => access the rest of the website. Otherwise can only access login, signup and forgot-->
          <div v-if="isSignedUp && !isForgetPassword && !isEmailSent">
            <login @loggedin="updateUserData" @forgot-password='isForgetPassword=true'/>
            <div style="text-align:center"><md-button class="md-raised md-primary" @click="isSignedUp=false">New here? Signup</md-button></div>
          </div>
          <div v-if="!isSignedUp && !isForgetPassword">
            <signup @signedup="updateUserData"/>
          </div>
          <div v-if="isForgetPassword">
            <forgotPassword @email-sent="triggerReset"/>
          </div>
          <div v-if="!isForgetPassword && isEmailSent">
            <resetPassword :username="userData.username" :reset_token="userData.reset_token" @passwordreset="passwordreseted"/>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
//import axios from "axios";
import VideoElementViewer from "./components/VideoElementViewer.vue";
import login from "./components/login.vue"
import signup from "./components/signup.vue"
import forgotPassword from "./components/forgotPassword.vue"
import resetPassword from "./components/resetPassword.vue"
import profile from "./components/profile.vue"
import upload from "./components/upload.vue"
import { mapGetters, mapState } from 'vuex'
    export default {
        name: 'App',
        components: {
          VideoElementViewer,
          login,
          signup,
          forgotPassword,
          resetPassword,
          profile,
          upload,
        },
        props: {
            PageTitle: String,
        },
        computed: {
          ...mapGetters({isAuth: 'account/isLoggedIn'}),
          ...mapState('submissions', {
              currentSubState: state => state.currentSubID,
          }),
        },
        mounted:{
          useCurrentSub(){
            this.currentSub = this.currentSubState
          }
        },
        data: () => ({
            menuVisible: false,
            currentPage: "Dashboard",
            isLoggedIn: false,
            isSignedUp:true,
            isForgetPassword:false,
            isEmailSent:false,
            currentSub:"",
            userData: {
              userID: "",
              username: "",
              password: "",
              token: "",
              reset_token: "",
            },
            menuItems: [
              {pageName: "Dashboard", pageIcon: "desktop_mac"},
              {pageName: "Upload", pageIcon: "upload"},
              {pageName: "Schedule", pageIcon: "calendar_month"},
              {pageName: "Profile", pageIcon: "account_circle"},
              {pageName: "Leaderboard", pageIcon: "format_list_numbered"},
            ],
        }),
        methods: {
          updatePage(page) {
            this.currentPage = page;
          },
          updateUserData(data){
            this.userData.userID = data.user_id
            this.userData.password = data.password
            this.userData.username = data.username
            this.userData.token = data.token
            this.isAuth = true;
            this.isSignedUp = true;
            this.currentPage = 'Dashboard'
          },
          triggerReset(data){
            this.userData.username = data.username
            this.userData.reset_token = data.reset_token
            console.log("new", this.userData)
            this.isEmailSent = true
            this.isForgetPassword = false
          },
          passwordreseted(data){
            this.userData.username = data.username
            this.userData.password = data.password
            this.isEmailSent = true
          }
        }
    }
</script>

<style scoped>
.md-app {
	border: 1px solid rgba(0, 0, 0, 0.12);
  min-height: 100vh;
}

.md-drawer {
	width: 230px;
	max-width: calc(100vw - 125px);
}
</style>