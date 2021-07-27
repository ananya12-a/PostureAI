<template>
    <div id="container" tabindex="0" @blur="$emit('closeSidebar')">
        <div v-for="element in elements" v-bind:key="element.text">
            <div class="menuElement">
                    <i :class="element.icon" class="fas"/>
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
                elements : [
                    {
                        text: "Dashboard",
                        icon: "fa-desktop",
                        link: "#",
                    },
                    {
                        text: "Upload",
                        icon: "fa-upload",
                        link: "#",
                    },
                    {
                        text: "Schedule",
                        icon: "fa-calendar",
                        link: "#",
                    },
                    {
                        text: "Profile",
                        icon: "fa-user",
                        link: "#",
                    },
                    {
                        text: "Leaderboard",
                        icon: "fa-list-ol",
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
    color: inherit;
}
</style>