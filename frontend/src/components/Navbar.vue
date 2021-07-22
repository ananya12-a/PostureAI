<template>

    <div id= "container">
        <div class="row">
            <div class="column col-left" id="icons">
                <i class="fas fa-bars vert-center-rev-half" @click="$emit('expandMenu')"/>
                <img src="@/assets/logo.png" class="vert-center-half"/>
            </div>
            <div class="column vert-center">{{PageTitle}}</div>
            <div class="column col-right vert-center" id="userSignIn">
                <div :class="`${highlightUserSignIn ? 'grey' : ''}`">
                    <i class="fas fa-user"/>
                    <p style="display:inline" 
                    @mouseover="highlightUserSignIn = true"
                    @mouseleave="highlightUserSignIn = false">{{name}}</p>
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
</style>