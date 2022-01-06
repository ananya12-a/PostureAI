<template>
    <div>
        <md-list id="friendsList">

            <md-subheader>Your Friends</md-subheader>
            <md-list-item v-for="item in this.friends" v-bind:key="item" @click="getInfo(item)">
                <span class="md-list-item-text" @click="showDialog = true">{{item}}</span>
                <md-dialog :md-active.sync="showDialog">
                    <md-dialog-title style="text-align:center">{{friendData.username}}</md-dialog-title>

                    <md-tabs md-dynamic-height>
                        <md-tab md-label="Statistics">
                            <md-list v-for="data in friendDataIcons" v-bind:key="data.name">
                                <md-list-item>
                                    <md-icon>{{data.icon}}</md-icon>
                                    <span class="md-list-item-text">{{data.show}} : {{friendData[data.name]}}</span>
                                </md-list-item>
                            </md-list>
                        </md-tab>
                    </md-tabs>

                    <md-dialog-actions>
                        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
                    </md-dialog-actions>
                </md-dialog>
            </md-list-item>
        </md-list>
        <!--<md-list>
            <md-subheader>Friends of {{this.username}}</md-subheader>
            <md-list-item v-for="item in this.friends" v-bind:key="item" @click="getInfo(item)">

                <span class="md-list-item-text">{{item}}</span>
            </md-list-item>
        </md-list>-->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props:{
        userID: String,
        username: String,
        token: String,
    },
    data: () =>({
        friends: [{'username':'test'}],
        friendData: [],
        showDialog: false,
        friendDataIcons:[
            {icon:'local_fire_department', name:'streaks', show:'Streaks'},
            {icon:'calendar_today', name:'days_active', show:'Days Active'},
            {icon: 'badge', name:'type', show:'User Type'},
            {icon:'history', name:'timestamp', show:'Joined on'}
        ]
    }),
    mounted(){
        axios.post("http://localhost:3000/social/get-friends-list", {user_id:this.userID, token:this.token})
        .then((res)=>{
            this.friends = res.data.friends
        })
    },
    methods:{
        getInfo(inputted_username){
            axios.post("http://localhost:3000/social/get-public-info", {user_id:this.userID, token:this.token, friendusername: inputted_username})
            .then((res)=>{
                console.log(res.data)
                //const keys = Object.keys(res.data)
                //const values = Object.values(res.data)
                this.friendData = res.data//[]
                /*for (let i =0; i<keys.length;i++){
                    this.friendData.push({"field": keys[i], "value": values[i]})
                }*/
                this.friendData.timestamp = new Date(this.friendData.timestamp*1000).toLocaleDateString("en-IN")
                console.log("i", this.friendData)
            })
        }
    }
}
</script>

<style scoped>
#friendsList {
    width: 320px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
  }
</style>