<template>
    <div>
        <div class="md-layout">
            <div class="md-layout-item">
                <md-field>
                <label>Video Upload</label>
                <md-file name='video' @change="handle" placeholder="Upload single video" accept="video/*" />
                </md-field>
                <md-button type="submit" class="md-primary" @click="upload">Upload</md-button>
                <div class="message">{{message}}</div>
            </div>
            <div class="md-layout-item">
                <md-select v-model="excerciseType" placeholder="Exercise Name"> <!--@change change exercise analysis-->
                    <md-optgroup label="Side View">
                        <md-option v-for="excerciseType in excerciseTypes.side" v-bind:key="excerciseType" :value="excerciseType">{{excerciseType}}</md-option>
                    </md-optgroup>
                    <md-optgroup label="Front View">
                        <md-option v-for="excerciseType in excerciseTypes.front" v-bind:key="excerciseType" :value="excerciseType">{{excerciseType}}</md-option>
                    </md-optgroup>
                </md-select>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapState, mapMutations} from 'vuex'
export default {
    data: ()=>({
        video:null,
        message:"",
        excerciseTypes: {side: ["Lunge (Side)", "Squat (Side)"], front: ["Side Lunge (Front)"]},
        excerciseType:"Lunge (Side)",
    }),
    methods:{
        handle(event) {
            this.video = event.target.files.length > 0 ? event.target.files[0] : null;
            console.log("handle", this.video)
        },
        upload(){
            if (!this.video) return; 
            const formDataObj = new FormData();
            formDataObj.append("video", this.video)
            console.log("upload", formDataObj.getAll('video'), this.userID, this.excerciseType)
            axios.post(`${this.baseURL}/upload/uploadfile/${this.userID}/${this.excerciseType}`, 
                formDataObj,
                {
                    'Content-Type': 'multipart/form-data'
                })
                .then(res => {
                    if (res.status === 200 && res.data && res.data.subID) {
                        //commit state change
                        // change sub id
                    }
                })
        },
        updateCurrentSub(subID){
            this.updateSubID(subID)
            this.$emit('newSubID', true)
        },
        ...mapMutations({updateSubID:'submissions/updateSubID'})
    },
    computed:{
        ...mapGetters({baseURL: 'urls/getURL'}),
        ...mapState('account', {
            username: state => state.username,
            userID: state => state.userID,
            token: state => state.token,
        }),
    }
}
</script>

<style scoped>

</style>