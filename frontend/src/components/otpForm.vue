<template>
    <div>
        <md-field :class="messageClass">
            <label>OTP</label>
            <md-input v-model="otp" type="number"></md-input>
            <!--<span class="md-error">Invalid Login</span>-->
        </md-field>

        <div style="text-align:center">
            <md-button class="md-raised md-primary" @click="submit">Submit</md-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapGetters } from 'vuex'
export default {
    data: () =>({
        otp:0,
        error:false,
    }),
    computed:{
        messageClass(){
            return {
                'md-invalid': this.error
            }
        },
        ...mapState('account', {
              username: state => state.username,
              token: state => state.token,
        }),
        ...mapGetters({baseURL: 'urls/getURL'})
    },
    methods:{
        submit(){
            console.log(this.otp, this.username)
            axios.get(`${this.baseURL}/account/verifyOTP/${this.otp}/${this.username}`, {})
            .then((res) => {
                if (res.status===200){
                    this.error=false;
                    console.log("res", res)
                    this.$emit('otp-verified', {
                        reset_token: res.data.token, 
                        username: res.data.username,
                    })
                }
                else{
                    console.log("unsuccessful OTP")
                    this.error = true
                }
                //console.log(res.status)
                //console.log(res.data)
            })
            .catch((err)=>{
                console.log("err", err)
            })
        }
    }
}
</script>

<style scoped>

</style>