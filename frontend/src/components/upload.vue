<template>
    <div>
        <md-field>
        <label>Video Upload</label>
        <md-file name='video' @change="handle" placeholder="Upload single video" accept="video/*" />
        </md-field>
        <md-button type="submit" class="md-primary" @click="upload">Upload</md-button>
        <div class="message">{{message}}</div>
    </div>
</template>

<script>
import axios from "axios";
import {mapGetters} from 'vuex'
export default {
    data: ()=>({
        video:null,
        message:"",
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
            console.log("upload", formDataObj.getAll('video'))
            axios.post(`${this.baseURL}/upload/uploadfile`, formDataObj,
                {
                    headers: {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
        }
    },
    computed:{
        ...mapGetters({baseURL: 'urls/getURL'})
    }
}
</script>

<style scoped>

</style>