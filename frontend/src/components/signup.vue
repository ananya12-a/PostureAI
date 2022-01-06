<template>
    <div>
        <md-field :class="error || usernameError ? 'md-invalid' : ''">
            <label>Username</label>
            <md-input v-model="username" autofocus @change="usernameExists"></md-input>
            <!--<span class="md-error">Invalid Login</span>-->
        </md-field>
        <div class = "error" v-if="usernameError">
            {{usernameErrorMessage}}
        </div>

        <md-field :class="messageClass">
            <label>Email</label>
            <md-input v-model="email" type="email"></md-input>
            <!--<span class="md-error">Invalid Login</span>-->
        </md-field>

        <md-field md-has-password :class="messageClass">
          <label>Password</label>
          <md-input v-model="password" type="password"></md-input>
          <!--<span class="md-error">Invalid Login</span>-->
        </md-field>

        <div class = "error" v-if="error">
            {{message}}
        </div>

        <div style="text-align:center">
            <md-button class="md-raised md-primary" @click="signup">Sign Up</md-button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data: ()=>({
        error:false,
        message:"",
        username:"",
        password:"",
        email:"",
        usernameError: false,
        usernameErrorMessage: "",
    }),
    computed: {
        messageClass () {
                        return {
                            'md-invalid': this.error
                        }
                    }
    },
    methods:{
        async usernameExists() {
            this.usernameError = !(await axios.get("http://localhost:3000/account/signup-helper/username/" + this.username)).exists;
            if (this.usernameError) {
                this.usernameErrorMessage = "Username Already Exists!";
            }//if you want to put requirements for username(verification) different ifs
        },
        signup() {
            const username = this.username
            const password = this.password
            const email = this.email

            axios.post("http://localhost:3000/account/signup", {
              username,
              password,
              email
            })
            .then((res) => {
                if (res.data.status){
                    this.error=false;
                    this.$emit('signedup', {username, password, user_id: res.data.user_id, token: res.data.token})
                }
                else{
                    console.log("unsuccessful")
                    this.error = true
                }
                console.log(res.status)
                console.log(res.data)
            })
            /*.catch((err) => {
                const res = err.response;
                console.log("unsuccessful")
                this.error = true;
                console.log(res)
                this.message = res.data ? res.data.error ? res.data.error : "" : "";
            })*/
        }
    }
}
</script>

<style scoped>
.error {
    color: red;
}
</style>