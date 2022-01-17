<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>

          <span class="md-title">{{currentPage}}</span>
          <div class="" style="margin-left:auto">
              <md-menu md-size="medium" md-direction="bottom-start" md-align-trigger  v-if="isAuth">
                <md-button class="md-icon-button" md-menu-trigger>
                  <md-icon class="md-size-2x">account_circle</md-icon>
                </md-button>

                <md-menu-content>
                  <md-icon class="md-size-3x">person</md-icon>
                  <span class="md-headline" style="text-align:center">{{this.username}}</span>
                  <md-menu-item @click="logout">
                    <md-icon>logout</md-icon>
                    <span>Log Out</span>
                  </md-menu-item>
                </md-menu-content>
              </md-menu>
          </div>
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
          <md-list-item v-for="item in menuItems" v-bind:key="item.pageName" @click="() => updateCurrentPage(item.pageName)">
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
            <profile :userID="userData.userID" :username="userData.username" :token="userData.token"/>
          </div>
          <div v-if="currentPage === 'Dashboard'">
          <VideoElementViewer/>
          </div>
          <div v-if="currentPage === 'Leaderboard'">
          <p> Leaderboards </p>
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
          <div v-if="isForgetPassword && !isEmailSent">
            <forgotPassword @email-sent="isEmailSent = true"/>
          </div>
          <div v-if="isEmailSent && isForgetPassword">
            <otpForm @otp-verified="triggerReset"/>
          </div>
          <div v-if="!isForgetPassword && isEmailSent">
            <resetPassword :username="userData.username" :token="userData.reset_token" @passwordreset="passwordreseted"/>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import axios from "axios";
import VideoElementViewer from "./components/VideoElementViewer.vue";
import login from "./components/login.vue"
import signup from "./components/signup.vue"
import forgotPassword from "./components/forgotPassword.vue"
import resetPassword from "./components/resetPassword.vue"
import profile from "./components/profile.vue"
import upload from "./components/upload.vue"
import otpForm from "./components/otpForm.vue"
import { mapGetters, mapState, mapMutations } from 'vuex'
import "./theme.scss"
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
          otpForm,
        },
        props: {
            PageTitle: String,
        },
        created: function() {
          const timer = setInterval(async () => {
            if (this.isAuth) {
              //console.log(this.username, this.token)
              await axios.post(this.baseURL + '/account/tokenVerify', {
                username: this.username,
                token: this.token
              })
                .then((res) => {
                  //console.log('returned response', res.data)
                  if (res.data && res.data.tokenValid === false) {
                    this.$store.commit('account/logout')
                  }
                })
            }
          }, 15000);

          this.$once("hook:beforeDestroy", () => {
            clearInterval(timer);
          });
        },
        computed: {
          ...mapGetters({isAuth: 'account/isLoggedIn', baseURL: 'urls/getURL', currentPage:'pages/getCurrentPage'}),
          ...mapState('submissions', {
              currentSub: state => state.currentSubID,
          }),
          ...mapState('account', {
              username: state => state.username,
              token: state => state.token,
          }),
          
        },
        data: () => ({
            menuVisible: false,
            //currentPage: "Dashboard",
            isLoggedIn: false,
            isSignedUp:true,
            isForgetPassword:false,
            isEmailSent:false,
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
          ...mapMutations({updateCurrentPage:'pages/updateCurrentPage'}),
          updateUserData(data){
            this.userData.userID = data.user_id
            console.log(this.userData.password)
            this.userData.password = data.password
            console.log(this.userData.password)
            this.userData.username = data.username
            this.userData.token = data.token
            this.isAuth = true;
            this.isSignedUp = true;
            //this.currentPage = 'Dashboard'
            this.updateCurrentPage('Dashboard')
          },
          triggerReset(data){
            this.userData.username = data.username
            this.userData.reset_token = data.reset_token
            console.log("new", this.userData)
            this.isEmailSent = true
            this.isForgetPassword = false
          },
          passwordreseted(data){
            console.log("called")
            this.userData.username = data.username
            this.userData.password = data.password
            this.isEmailSent = false
            console.log(this.isSignedUp, !this.isForgetPassword, !this.isEmailSent)
          },
          logout(){
            this.$store.commit('account/logout')
          },
        }
    }
    /*
*/
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