<template>

    <div id= "container">
        <div class="row">
            <div class="column col-left" id="icons">
                <i class="fas fa-bars vert-center-rev-half" @click="$emit('expandMenu')"/>
                <img src="@/assets/logo.png" class="vert-center-half"/>
            </div>
            <div class="column vert-center">{{PageTitle}}</div>
            <div class="column col-right vert-center" id="userSignIn" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
                <div :class="`${highlightUserSignIn ? 'grey' : ''}`">
                    <i class="fas fa-user"/>
                    <p style="display:inline" 
                    @mouseover="highlightUserSignIn = true"
                    @mouseleave="highlightUserSignIn = false">{{name}}</p>
                </div>
                <div v-if="showDropdown" class="menuElement grey">
                    <div class="circular-portrait">
                        <img src="@/assets/logo.png"/>
                    </div>
                    <h4 class="username">{{name}}</h4>
                    <hr>
                    <div v-for="element in elements" v-bind:key="element.text">
                        <div>
                                <i :class="element.icon" class="fas"/>
                                <span> <a :href="element.link"> {{element.text}} </a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            PageTitle: String,
        },
        data: function() {
            let data = {
                name: "John Doe",
                highlightUserSignIn: false,
                showDropdown: false,
                elements: [
                    {
                        text: "Add Account",
                        icon: "fa-user-plus",
                        link: "#",
                    },
                    {
                        text: "Sign out",
                        icon: "fa-sign-out-alt",
                        link: "#",
                    },
                    {
                        text: "Settings",
                        icon: "fa-cog",
                        link: "#",
                    },
                ]
            };
            window.changeUserNameOnNav = function(newName) {
                data.name = newName;
            }
            return data
        },
    }
</script>

<style scoped>
.row {
  background-color: rgba(216, 216, 216, 0.4);
  font-size: 24px;
  display: flex;
  height: 2em;
}
.username{
    text-align:center;
    margin: 5% 0;
}
.menuElement{
    padding: 5% 3%;
}
.circular-portrait img {
  width: 40%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  border-radius: 50%;
}
.column {
  flex: 33%;
  text-align: center;
  margin: 0;
}

.vert-center {
  -ms-transform: translateY(0.5em);
  transform: translateY(0.5em);
}

.vert-center-half {
  -ms-transform: translateY(0.25em);
  transform: translateY(0.25em);
}
.vert-center-rev-half {
  -ms-transform: translateY(-0.25em);
  transform: translateY(-0.25em);
}

.col-left {
    text-align: left;
}

.col-left > img {
    height: 80%;
}

.col-right {
    text-align: right;
}
#userSignIn {
    padding-right: 1%;
}
#userSignIn> div> i {
    padding-right: 2%;
}
#icons> i {
    padding-left: 4%;
    padding-right: 8%;
}
.grey {
    background-color: rgba(216, 216, 216, 0.6);
}
.menuElement{
    float:right;
    margin-top:1.5%;
    text-align:left;
    width:fit-content;
    z-index: 999;
}
.menuElement > div > div > i{
    padding:1% 2%;
}
a{
    color: inherit;
    text-decoration: none;
}
</style>