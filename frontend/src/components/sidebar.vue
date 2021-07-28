<template>
    <div id="container">
        <div class = "sidebar-section">
            <div class = "sidebar-element" v-for="element in elements" v-bind:key="element.text">
                <div class="sidebar-element-inner">
                        <i :class="element.icon" class="fas"/>
                        <span> <a :href="element.link"> {{element.text}} </a></span>
                </div>
            </div>
        </div>
        <div class = "sidebar-section"> hasdlfasd</div>
    </div>
</template>

<script>
    export default {
        components:{
        },
        props: {
        },
        methods: {
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

#container {
    box-shadow: 0 15px 25px rgba(0,0,0,0.25);
}

#container:first-child {
    padding-top: 2em; 
}

#container .sidebar-section:not(:first-child){
    border-top:1px solid lightgray;
    padding-top: 10px;
}

.sidebar-element {
    margin-top: 0.5em;
    line-height: 1.5em;
    text-align: left;
    width: 80%;
    margin-bottom: 0.5em;
}
.sidebar-element-inner > i {
    margin-left: 5%;
}
.sidebar-element:hover {
    background-color: lightgray;
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
}
.sidebar-section {
    text-align: left;
    padding-left: 0;
}
#container {
    height: 100%;
    background-color: white;
}
a {
    text-decoration: none !important;
    color: inherit;
}
</style>