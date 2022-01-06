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
        }
    },
    methods:{
        forgot_password () {
            const username = this.username
            const email = this.email

            axios.get(`http://localhost:3000/account/forgot-password/${username}/${email}`, {})
            .then((res) => {
                if (res.data.status){
                    this.error=false;
                    this.$emit('email-sent', {username, reset_token: res.data.reset_token})
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