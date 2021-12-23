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

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <md-list-item v-for="item in menuItems" v-bind:key="item.pageName" @click="() => updatePage(item.pageName)">
            <span class="md-list-item-text" style="display:inline">
                <md-icon style="display:inline">{{item.pageIcon}}</md-icon>
                <p style="display:inline-block">{{item.pageName}}</p>
            </span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div v-if="currentPage==='Upload'">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae maxime? Quae non explicabo, neque.</p>
        </div>
        <div v-if="currentPage === 'Dashboard'">
        <VideoElementViewer/>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import VideoElementViewer from "./components/VideoElementViewer.vue";
    export default {
        name: 'App',
        components: {
          VideoElementViewer,
        },
        props: {
            PageTitle: String,
        },
        data: () => ({
            menuVisible: false,
            currentPage: "Dashboard",
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
          }
        }
    }
</script>

<style scoped>
.md-app {
	border: 1px solid rgba(0, 0, 0, 0.12);
}

.md-drawer {
	width: 230px;
	max-width: calc(100vw - 125px);
}
</style>