<template>
    <div id="container" tabindex="0" @blur="$emit('closeSidebar')">
        <div v-for="element in elements" v-bind:key="element.text">
            <div class="menuElement">
                    <i :class="element.icon" />
                    <span> <a :href="element.link"> {{element.text}} </a></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components:{
        },
        data: function() {
            return {
                elements: [
                    {
                        text: "Home",
                        icon: "fa-home",
                        link: "#",
                    },
                    {
                        text: "Settings",
                        icon: "fa-hamburger",
                        link: "#",
                    },
                    {
                        text: "Account",
                        icon: "fa-user",
                        link: "#",
                    },
                ]
            }
        },
        
    }
</script>

<style scoped>
.menuElement {
    line-height: 2em;
    text-align: center;
}
#container {
    height: 100%;
    background-color: salmon;
}
a {
    text-decoration: none !important;
}
</style>