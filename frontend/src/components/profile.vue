<template>
    <div>
        <md-tabs>
            <md-tab id="tab-information" md-label="Profile" exact>
                Home Tab
            </md-tab>
            <md-tab id="tab-friends" md-label="Friends">
                <friendsList :userID="userID" :username="username" :token="token"/>
            </md-tab>
            <md-tab id="tab-submissions" md-label="Submissions">
                <submissions @newSubID="updateSubID"/>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
import friendsList from "./friendsList.vue";
import submissions from "./submissions.vue";
export default {
    components:{
        friendsList,
        submissions,
    },
    props:{
        userID: String,
        username: String,
        token: String,
    },
    methods:{
        updateSubID(ifUpdated){
            this.$emit('subUpdated', ifUpdated)
        }
    }
}
</script>

<style scoped>

</style>