<template>
    <div>
        <md-field md-has-password :class="messageClass">
            <label>Temporary Password</label>
            <md-input v-model="temp_password" type="password"></md-input>
        </md-field>

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
export default {
    props:{
        username: String,
        reset_token :String,
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
        }
    },
    methods :{
        reset_password(){
            const username = this.username
            if (this.repassword===this.password){
                console.log("reset", this.reset_token)
                axios.post(`http://localhost:3000/account/reset-password/${this.reset_token}`, {
                    new_password: this.password
                })
                .then((res) => {
                    if (res.data.status){
                        this.error=false;
                        this.$emit('passwordreset', {username, password: this.password})
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
            else this.error = true
        }
    }
}
</script>

<style scoped>

</style>