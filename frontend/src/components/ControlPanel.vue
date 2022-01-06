<template>
    <div>
        <div class="md-layout md-gutter">
            <md-field class="md-layout-item">
                <md-select v-model="excerciseType" id="movie" placeholder="Exercise Name"> <!--@change change exercise analysis-->
                    <md-optgroup label="Side View">
                        <md-option v-for="excerciseType in excerciseTypes.side" v-bind:key="excerciseType" :value="excerciseType">{{excerciseType}}</md-option>
                    </md-optgroup>
                    <md-optgroup label="Front View">
                        <md-option v-for="excerciseType in excerciseTypes.front" v-bind:key="excerciseType" :value="excerciseType">{{excerciseType}}</md-option>
                    </md-optgroup>
                </md-select>
            </md-field>
            <md-switch v-model="annotations" @change="$emit('sameFrame')" class="annotation-switch md-layout-item">{{ !annotations ? 'Show' : 'Hide' }} annotations</md-switch>
        </div>
        <div class="md-layout md-gutter second-row">
            <div class="md-layout-item">
                <VueSlider v-model="framerate" :min="0" :max="120" :interval="1" class="framerate-slider" @change="$emit('framerate-update', framerate)"/>
                Framerate: {{framerate}}
            </div>
            <div class="md-layout-item">
                <md-button class="md-icon-button md-raised" @click="$emit('prevFrame')">
                    <md-icon>fast_rewind</md-icon>
                </md-button>
                <md-button class="md-icon-button md-raised" @click="$emit('nextFrame')">
                    <md-icon>fast_forward</md-icon>
                </md-button>
            </div>    
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/material.css'
export default {
    components:{
        VueSlider,
    },
    props:{
        excerciseTypes:[],
        framerate: Number,
        annotations: Boolean,
    },
    data: () => {
        return {  
            excerciseType:String,
        }
    },
    watch: {
        excerciseType: function() {
            this.$emit('exercise-update', this.excerciseType);
        }
    }
}
</script>

<style scoped>

.annotation-switch{
    display:inline;
    margin:5% 0%;
}

.md-switch {
    display: flex;
}
</style>