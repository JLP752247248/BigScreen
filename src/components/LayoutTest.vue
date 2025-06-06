<template>
  <div style="background-color: bisque; width: 100%; height: 100%">
    <div style="background-color: aqua; width: 100%; height: 40px; border-color: black; margin: 5px 5px"></div>
    <div class="maincontent">
      <div class="left">
        <span>span</span>
      </div>
      <div class="right wrapper whitewrapper">
        <SketchRule
          :scale="scala"
          :thick="30"
          :startX="0"
          :startY="0"
          :width="3200"
          :height="3200"
          :canvas-width="3000"
          :canvas-height="3000"
          :cornerActive= "true"
          :showShadowText="false"
          :showRuler="true"
          :palette="palette"
          @dragover.prevent
          @drop="handleDrop"
          @handleLine="handleLine"
        >
          <div class="screens">
              <div class="canvas">

              </div>
          </div>
        </SketchRule>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SketchRule from 'vue3-sketch-ruler';
const scala = ref(1);
const palette = ref( {bgColor: "transparent", lineType: "dashed" });


</script>

<style scoped>
@import 'vue3-sketch-ruler/lib/style.css';
.maincontent {
  background-color: yellow;
  width: 100%;
  height: calc(100% - 40px);
  border-color: black;
  margin: 5px 5px;
}
.left {
  width: 300px;
  background-color: blueviolet;
  float: left;
  height: 100%;
}
.right {
  width: calc(100% - 300px);
  float: left;
  height: 400px;
  overflow: scroll;
}
.canvas{
  width: 600px;
  height: 300px;
  background-color: chocolate;
}
.wrapper {
  background-size: 21px 21px, 21px 21px;
}
.whitewrapper {
  background-color: #fafafc;
  background-image: linear-gradient(#fafafc 20px, transparent 0),
    linear-gradient(90deg, transparent 20px, #373739 0);
}
</style>
