<template>
    <div>
        <md-field :class="messageClass">
            <label>Username</label>
            <md-input v-model="username" autofocus></md-input>
            <!--<span class="md-error">Invalid Login</span>-->
        </md-field>

        <md-field :class="messageClass">
            <label>Email</label>
            <md-input v-model="email" type="email"></md-input>
            <!--<span class="md-error">Invalid Login</span>-->
        </md-field>

        <div style="text-align:center">
            <md-button class="md-raised md-primary" @click="forgot_password">Forgot Password</md-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations} from 'vuex'
export default {
    data: ()=>({
        error:false,
        username:"",
        email:"",
    }),
    computed: {
        messageClass(){
            return {
                'md-invalid': this.error
            }
        },
        ...mapGetters({baseURL: 'urls/getURL'})
    },
    methods:{
        ...mapMutations({updateUsername:'account/forgotpassword'}),
        forgot_password () {
            const username = this.username
            const email = this.email
            this.updateUsername(this.username)
            //console.log(`${this.baseURL}/account/forgot-password/${username}/${email}`)
            axios.get(`${this.baseURL}/account/forgot-password/${username}/${email}`, {})
            .then((res) => {
                if (res.status===200){
                    this.error=false;
                    this.$emit('email-sent')
                }
                else{
                    console.log("unsuccessful")
                    this.error = true
                }
                console.log(res.status)
                console.log(res.data)
            })
            .catch(() => {
                console.log("unsuccessful")
                this.error = true
            })
        }
    }
}
</script>

<style scoped>

</style>