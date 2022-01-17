<template>
    <div>
        <div class="md-layout md-gutter">
            <div class="md-layout-item">
                <span class="md-subheading">Start Date:</span>
                <md-datepicker v-model="startDate" md-immediately/>
                <span class="md-subheading">End Date:</span>
                <md-datepicker v-model="endDate" md-immediately :md-disabled-dates="disabledDates"/>
            </div>
            <div class="md-layout-item">
                <md-field>
                    <label>Start Number</label>
                    <md-input v-model="startNumber" type="number"></md-input>
                    <span class="md-error">There is an error</span>
                </md-field>
                <md-field>
                    <label>End Number</label>
                    <md-input v-model="endNumber" type="number"></md-input>
                    <span class="md-error">There is an error</span>
                </md-field>
            </div>
        </div>
        <md-list>
            <md-subheader>Submissions</md-subheader>
            <md-list-item v-for="(item, index) in this.submissions" v-bind:key="index" @click="getInfo(item)">
                <span class="md-list-item-text" @click="showDialog = true"><b>{{timestamps[index]}} :</b> {{item}}</span>
                <md-dialog :md-active.sync="showDialog">
                    <md-dialog-title style="text-align:center">{{subData.timestamp}}</md-dialog-title>

                    <md-tabs md-dynamic-height>
                        <md-tab md-label="Statistics">
                            <md-list v-for="data in subDataIcons" v-bind:key="data.name">
                                <md-list-item>
                                    <md-icon>{{data.icon}}</md-icon>
                                    <span class="md-list-item-text">{{data.show}} : {{subData[data.name]}}</span>
                                </md-list-item>
                            </md-list>
                        </md-tab>
                        <md-tab md-label="Video">
                            <video  controlsList="nodownload nofullscreen">
                                <source src="@/assets/squatSide.mp4" type="video/mp4"/>
                            </video>
                        </md-tab>
                    </md-tabs>

                    <md-dialog-actions>
                        <md-button class="md-primary" @click="updateCurrentSub(item)">Open in Dashboard</md-button>
                        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
                    </md-dialog-actions>
                </md-dialog>
            </md-list-item>
        </md-list>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState, mapGetters, mapMutations} from 'vuex'
export default {
    data: () => ({
        startDate: null,
        endDate: new Date(),
        startNumber: null,
        endNumber:null,
        submissions: [],
        timestamps:[],
        subData: [],
        showDialog: false,
        subDataIcons:[
            {icon:'local_fire_department', name:'difficulty', show:'Difficulty'},
            {icon:'fitness_center', name:'exercise', show:'Exercise'},
            {icon:'videocam', name:'orientation', show:'Orientation'},
            {icon:'score', name:'overall_score', show:'Overall Score'},
            {icon:'schedule', name:'seconds_analysed', show:'Seconds Analysed'},
        ]
    }),
    computed: {
      messageClass () {
        return {
          'md-invalid': this.hasMessages
        }
      },
      ...mapState('account', {
          username: state => state.username,
          userID: state => state.userID,
          token: state => state.token,
      }),
      
      ...mapGetters({baseURL: 'urls/getURL'})
    },
    watch:{
        startNumber: function (){
            
            if (this.startNumber != null && this.endNumber != null && this.startNumber != undefined && this.endNumber != undefined){
                console.log(this.baseURL)
                axios.post(`${this.baseURL}/submission/get-submission-list/number/${this.startNumber}/${this.endNumber}`, {user_id:this.userID, token:this.token, username: this.username})
                .then((res)=>{

                    this.submissions = res.data.submissions
                    for (let i=0; i<res.data.timestamps.length;i++){
                        this.timestamps[i] =  new Date(res.data.timestamps[i]).toLocaleString()
                    }
                })
            }
        },
        endNumber: function(){
            if (this.startNumber != null && this.endNumber != null && this.startNumber != undefined && this.endNumber != undefined){
                console.log(this.baseURL)
                axios.post(`${this.baseURL}/submission/get-submission-list/number/${this.startNumber}/${this.endNumber}`, {user_id:this.userID, token:this.token, username: this.username})
                .then((res)=>{
                    this.submissions = res.data.submissions
                    for (let i=0; i<res.data.timestamps.length;i++){
                        this.timestamps[i] =  new Date(res.data.timestamps[i]).toLocaleString()
                    }
                    
                })
            }
        },
        startDate: function (){
            console.log(this.username)
            if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined){
                console.log(this.startDate)
                axios.post(`${this.baseURL}/submission/get-submission-list/date/${this.startDate.getTime()}/${this.endDate.getTime()}`, {user_id:this.userID, token:this.token, username: this.username})
                .then((res)=>{
                    this.submissions = res.data.submissions
                    console.log(this.submissions)
                    for (let i=0; i<res.data.timestamps.length;i++){
                        this.timestamps[i] =  new Date(res.data.timestamps[i]).toLocaleString()
                    }
                })
            }
        },
        endDate: function(){
            if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined){
                axios.post(`${this.baseURL}/submission/get-submission-list/date/${this.startDate.getTime()}/${this.endDate.getTime()}`, {user_id:this.userID, token:this.token, username: this.username})
                .then((res)=>{
                    this.submissions = res.data.submissions
                    console.log(this.submissions)
                    for (let i=0; i<res.data.timestamps.length;i++){
                        this.timestamps[i] =  new Date(res.data.timestamps[i]).toLocaleString()
                    }
                    
                })
            }
        }
    },
    methods:{
        getInfo(subID){
            axios.post(`${this.baseURL}/submission/get-submission-data`, {user_id:this.userID, token:this.token, submissionID: subID})
            .then((res)=>{
                console.log(res.data)
                //const keys = Object.keys(res.data)
                //const values = Object.values(res.data)
                this.subData = res.data//[]
                /*for (let i =0; i<keys.length;i++){
                    this.friendData.push({"field": keys[i], "value": values[i]})
                }*/
                this.subData.timestamp = new Date(this.subData.timestamp*1000).toLocaleString()
                console.log("i", this.subData)
            })
        },
        disabledDates(date){
            //console.log(this.startDate, date, date>=new Date(this.startDate))
            return date<new Date(this.startDate)
        },
        ...mapMutations({updateSubID:'submissions/updateSubID', updateCurrentPage:'pages/updateCurrentPage'}),
        updateCurrentSub(subID){
            this.updateSubID(subID)
            this.updateCurrentPage('Dashboard')
        },
        
    }
}
</script>

<style scoped>

</style>