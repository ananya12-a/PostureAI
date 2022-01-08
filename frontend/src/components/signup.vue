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

        <md-field :class="error || emailError ? 'md-invalid' : ''">
            <label>Email</label>
            <md-input v-model="email" type="email" @change="emailExists"></md-input>
            <!--<span class="md-error">Invalid Login</span>-->
        </md-field>
        <div class = "error" v-if="emailError">
            {{emailErrorMessage}}
        </div>
        

        <md-field md-has-password :class="error || passwordError ? 'md-invalid' : ''">
          <label>Password</label>
          <md-input v-model="password" type="password" @change="passwordVerification"></md-input>
          <!--<span class="md-error">Invalid Login</span>-->
        </md-field>
        <div class = "error" v-if="passwordError">
            {{passwordErrorMessage}}
        </div>

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
import {mapGetters} from "vuex";

export default {
    data: ()=>({
        error:false,
        message:"",
        username:"",
        password:"",
        email:"",
        usernameError: false,
        usernameErrorMessage: "",
        emailError: false,
        emailErrorMessage: "",
        emailRegex:/^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/,
        passwordError: false,
        passwordErrorMessage: "",
        passwordRegex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    }),
    computed: {
        messageClass () {
                        return {
                            'md-invalid': this.error
                        }
                    },
        ...mapGetters({baseURL: 'urls/getURL'})
    },
    methods:{
        async usernameExists() {
            this.usernameError = (await axios.get(this.baseURL + "/account/signup-helper/username/" + this.username)).data.exists;
            console.log(this.usernameError)
            if (this.usernameError) {
                this.usernameErrorMessage = "Username Already Exists!";
            }//if you want to put requirements for username(verification) different ifs
        },
        async emailExists() {
            this.emailError = (await axios.get(this.baseURL + "/account/signup-helper/email/" + this.email)).data.exists;
            console.log(this.emailError, this.email)
            if (this.emailError) {
                this.emailErrorMessage = "Email Already Registered!";
            }
            else if (!this.email.match(this.emailRegex)){
                this.emailError = true
                this.emailErrorMessage = "Not a valid email"
            }
        },
        async passwordVerification(){
            if (!this.password.match(this.passwordRegex)){
                this.passwordError = true
                this.passwordErrorMessage = "Please ensure you have atleast eight characters, one uppercase letter, one lowercase letter and one number."
            }
        },
        signup() {
            const username = this.username
            const password = this.password
            const email = this.email

            axios.post(this.baseURL + "/account/signup", {
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