<template>
    <div>

        <md-field md-has-password :class="messageClass">
            <label>New Password</label>
            <md-input v-model="password" type="password"></md-input>
            <span class="md-error">Passwords don't match</span>
        </md-field>

        <md-field md-has-password :class="messageClass">
            <label>Confirm Password</label>
            <md-input v-model="repassword" type="password"></md-input>
            <span class="md-error">Passwords don't match</span>
        </md-field>

       <div style="text-align:center">
            <md-button class="md-raised md-primary" @click="reset_password">Reset Password</md-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {mapGetters} from 'vuex'
export default {
    props:{
        username: String,
        token :String,
    },
    data: ()=>({
        error:false,
        password:"",
        repassword:"",
    }),
    computed: {
        messageClass(){
            return {
                'md-invalid': this.error
            }
        },
        ...mapGetters({baseURL: 'urls/getURL'})
    },
    methods :{
        reset_password(){
            if (this.repassword===this.password){
                console.log("reset", this.token, `${this.baseURL}/account/reset-password/${this.token}`)
                axios.post(`${this.baseURL}/account/reset-password/${this.token}`, {
                    new_password: this.password,
                    username: this.username,
                })
                .then((res) => {
                    if (res.status===200){
                        this.error=false;
                        this.$emit('passwordreset', {username: this.username, password: this.password})
                    }
                    else{
                        console.log("unsuccessful")
                        this.error = true
                    }
                    console.log(res.status)
                    console.log(res.data)
                })
                .catch((err) => {
                    console.log("unsuccessful", err)
                    this.error = true
                })
            }
            else this.error = true
        }
    }
}
</script>

<style scoped>

</style>