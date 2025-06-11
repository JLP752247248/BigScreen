<template>
  <div style="background-color: bisque; width: 100%; height: 100%">
    <div style="background-color: aqua; width: 100%; height: 40px; border-color: black; margin: 5px 5px"></div>
    <div class="maincontent">
      <div class="left">
        <span>span</span>
      </div>
      <div class="right wrapper whitewrapper">
        <div class="right-tools">
          <el-select v-model="selectedResolution" @change="updateDivSize">
            <el-option
              v-for="item in resolutions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <SketchRule
          ref="rulerRef"
          :scale="1"
          :thick="20"
          :startX="-30"
          :startY="-30"
          :width="5000"
          :height="4000"
          :rate="1"
          :autoCenter="false"
          :canvas-width="5200"
          :canvas-height="4200"
          :cornerActive= "true"
          :showShadowText="false"
          :showRuler="true"
          :palette="palette"
          :gridRatio="1"
          :innerHeight="50"
          :innerWidth="50"
          @dragover.prevent
          @drop="handleDrop"
          @handleLine="handleLine"
        >
          <div id="dpanel" class="canvas" :style="{
              width: canvasStyle.width + 'px',
              height: canvasStyle.height + 'px'
            }"
            @drop="handleDrop"
            >
                <div
                v-for="(item, index) in canvasItems"
                :key="index"
                class="chart-container"
                :style="{
                  width: item.width + 'px',
                  height: item.height + 'px',
                  left: item.x + 'px',
                  top: item.y + 'px',
                }"
                draggable="true"
                @mousedown="startDragFromPanel($event, item)"
              >
                <div>
                  <EChartsWrapper :type="item.type"></EChartsWrapper>
                  <div class="chart-controls">
                    <el-icon @click="removeChart(index)">
                      <Close />
                    </el-icon>
                  </div>
                </div>
            </div>
          </div>
        </SketchRule>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EChartsWrapper from './EChartsWrapper.vue';

import SketchRule from './vue3-sketch-rule/sketch-ruler/SketchRuler.vue';
const palette = ref( {
        bgColor: 'lightblue',
        longfgColor: '#BABBBC',
        shortfgColor: '#C8CDD0',
        fontColor: '#7D8694',
        shadowColor: 'transparent',
        lineColor: '#0089d0',
        borderColor: '#transparent',
        cornerActiveColor: 'rgb(235, 86, 72, 0.6)'
      });
const resolutions =  ref([
        { value: '1920x1080', label: '1920×1080 (FHD)' },
        { value: '256x144', label: '256x144' },
        { value: '840x560', label: '840x560' }
      ]);
const rulerRef = ref(null);
const selectedResolution= ref('1920x1080');
const canvasStyle = ref({
        width: 1920,
        height: 1080
      });
const updateDivSize = () => {
      const [width, height] = selectedResolution.value.split('x')
      canvasStyle.value = {
        width: parseInt(width),
        height: parseInt(height)
      }
}
const canvasItems = ref([{
        id: 99,
        type: 'bar',
        width: 200,
        height: 200,
        name: 'bar',
      }]);
const draggedItem = ref(null);
const startDragFromPanel = (e, item) => {
  console.log(e);
  console.log(item);
  draggedItem.value = item;
 //dragType.value = 'move';
};

const handleDrop = e => {
  console.log(e);
  const rect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  console.log(e.currentTarget);
  console.log(rect);
  draggedItem.value = Object.assign(draggedItem.value, { x: offsetX, y: offsetY });
  console.log('canvasItems');
  console.log(canvasItems);
};
</script>

<style scoped>
@import 'vue3-sketch-ruler/lib/style.css';
.maincontent {
  width: 100%;
  height: calc(100% - 40px);
  border-color: black;
  margin: 5px 5px;
}
.left {
  width: 300px;
  float: left;
  height: 100%;
}
.right {
  width: calc(100% - 300px);
  float: left;
  height: 800px;
  overflow: scroll;
}
.right-tools{
  float: right;
  width: 200px;
}
.wrapper {
  background-size: 21px 21px, 21px 21px;
  overflow: scroll;
}
.screens{
  top: 50px;
  left: 100px;
}
.canvas{
    background-color: #FFFACD;
    background-image: radial-gradient(#FF0000 1px, transparent 1px);
    background-size: 50px 50px;
    margin: 50px 50px;
    width:900px;
    height: 700px;
}
.chart-container {
  position: absolute;
  border: 1px solid #ddd;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}


</style>
