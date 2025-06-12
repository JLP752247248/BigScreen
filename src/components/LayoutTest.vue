<template>
  <div style="background-color: bisque; width: 100%; height: 100%">
    <div style="background-color: aqua; width: 100%; height: 40px; border-color: black; margin: 5px 5px"></div>
    <div class="maincontent">
      <div class="left">
        <el-tabs v-model="activeName" tab-position="left" style="height: 200px" class="left-tabs-box" @tab-click="tabClick">
          <el-tab-pane name="default" @click="changeActiveCode('')">
            <template #label>
              <span class="menu-slot" name="default" @click="toggleSidebar">
                <span class="menu-title-span">{{ foldText }}</span>
              </span>
            </template>
          </el-tab-pane>

          <el-tab-pane name="layer">
            <template #label>
              <div class="menu-slot" name="layer" @dblclick="toggleSidebar">
                <i :class="['iconfont-bigscreen', 'icon-layer']" class="menu-icon" />
                <span class="menu-title-span">图层</span>
              </div>
            </template>
            <div class="page-left-content"></div>
          </el-tab-pane>

          <el-tab-pane
            v-for="menu in menuList"
            :key="menu.id"
            :name="menu.name"
            @click.stop="changeActiveCode('')"
            style="border-color: blueviolet"
          >
            <template #label>
              <div class="menu-slot" @dblclick="toggleSidebar">
                <span class="menu-title-span">{{ menu.title }}</span>
              </div>
            </template>

            <el-scrollbar style="height: 200px">
              <div
                v-for="comp in menu.components"
                :key="comp.id"
                :name="comp.name"
                draggable="true"
                @dragstart="handleDragStart($event, comp)"
              >
                <el-image style="width: 100px; height: 100px" :src="imageUrl" :fit="fit" />
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right wrapper whitewrapper">
        <div class="right-tools">
           
          <el-select v-model="selectedResolution" 
          :label="分辨率"
          @change="updateDivSize" style="width:200px;float: right;"> 
            <el-option v-for="item in resolutions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
          :cornerActive="true"
          :showShadowText="false"
          :showRuler="true"
          :palette="palette"
          :gridRatio="1"
          :innerHeight="50"
          :innerWidth="50"
          @dragover.prevent
          @drop="handleDrop"
          @handleLine="handleLine"
          :lines="snapLines"
        >
          <div
            id="dpanel"
            class="canvas"
            :style="{
              width: canvasStyle.width + 'px',
              height: canvasStyle.height + 'px',
            }"
            @drop="handleDrop"
          >
<DraggableContainer adsorbParent="false">
              <Vue3DraggableResizable
               v-for="(item, index) in canvasItems"
              :key="index"
              class="chart-container"
                :initW="item.width"
                :initH="item.height"
                v-model:x="item.x"
                v-model:y="item.y"
                v-model:w="item.width"
                v-model:h="item.height"
                v-model:active="active"
                :draggable="true"
                :resizable="true"
                :parent="true"
                @activated="print('activated')"
                @deactivated="print('deactivated')"
                @drag-start="print('drag-start')"
                @resize-start="print('resize-start')"
                @dragging="print('dragging')"
                @resizing="print('resizing')"
                @drag-end="print('drag-end')"
                @resize-end="size => handleResizeEnd(index,size)"
                :ref="registerRef"
                @mousedown="handleItemClick($event)"
                @pointermove="handleItemClick($event)"
              >
                <EChartsWrapper :type="item.type" :width="item.width" :height="item.height">
                 
                </EChartsWrapper>{{ item }}
                <div class="chart-controls">
                  <el-icon @click="removeChart(index)">
                    <Close />
                  </el-icon>
                </div>
              </Vue3DraggableResizable>
              </DraggableContainer>
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
import Vue3DraggableResizable from './vue3-draggable-resizable/Vue3DraggableResizable';
import  DraggableContainer from 'vue3-draggable-resizable/src/components/DraggableContainer'
const snapLines = ref({
  h: [], // 水平吸附线位置
  v: []       // 垂直吸附线位置
});
const palette = ref({
  bgColor: 'grey',
  longfgColor: 'pink',
  shortfgColor: 'pink',
  fontColor: 'black',
  shadowColor: 'transparent',
  lineColor: '#0089d0',
  borderColor: '#transparent',
  cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
});
const resolutions = ref([
  { value: '1920x1080', label: '1920×1080 (FHD)' },
  { value: '256x144', label: '256x144' },
  { value: '840x560', label: '840x560' },
]);
const rulerRef = ref(null);
const selectedResolution = ref('1920x1080');
const canvasStyle = ref({
  width: 1920,
  height: 1080,
});
const updateDivSize = () => {
  const [width, height] = selectedResolution.value.split('x');
  canvasStyle.value = {
    width: parseInt(width),
    height: parseInt(height),
  };
};
const foldText = 'foldText';
const menuList = [
  {
    id: 12,
    name: 'xxx',
    title: 'tttt',
    components: [
      {
      id: 99,
      type: 'bar',
      width: 200,
      height: 200,
      name: 'bar',
    },
    {
      id: 98,
      type: 'line',
      width: 400,
      height: 200,
      name: 'line',
      x: 400,
      y: 500,
    },
    {
      id: 97,
      type: 'pie',
      width: 400,
      height: 200,
      name: 'pie',
      x: 400,
      y: 500,
    },
      ],
  },
  {
    id: 13,
    name: 'yyy',
    title: 'ccccccc',
  },
];


const canvasItems = ref([]);
const draggedItem = ref(null);
const imageUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
const dragType = ref([]);
const handleDragStart = (e, item) => {
 // console.log(e);
 // console.log(item);
  draggedItem.value = Object.assign({}, item);
  dragType.value = 'add';
};
const handleItemClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = document.getElementById('dpanel');

  
  const parentRect = parent.getBoundingClientRect();
    snapLines.value = {
      h: [rect.top-parentRect.top, rect.bottom-parentRect.top]  , // 水平吸附线位置
      v: [rect.left-parentRect.left,rect.right-parentRect.left]     // 垂直吸附线位置
    };
    console.log(snapLines.value);
};
const print = val => {
  console.log(val);
};

const handleResizeEnd = (index,size) => {
  //console.log(size)
  //console.log(index)
  
  //console.log( canvasItems.value[index])
  canvasItems.value[index].width = size.w;
  canvasItems.value[index].height = size.h;
}
const draggableRefs = ref([])
const registerRef = (el) => {
  if (el) draggableRefs.value.push(el)
 // console.log(draggableRefs)
}

const handleDrop = e => {
  console.log(e);
  const rect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
 // console.log(e.currentTarget);
  //console.log(rect);
  if(!draggedItem.value){
    return;
  }
  draggedItem.value = Object.assign(draggedItem.value, { x: offsetX, y: offsetY });
  if (dragType.value == 'add') {
    canvasItems.value.push(draggedItem.value);
  }
  draggedItem.value = null;
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
  background-color: beige;  
  display: flex;
  flex: 1;
  overflow: hidden;
}
.right {
  width: calc(100% - 300px);
  float: left;
  height: 800px;
  overflow: scroll;
}
.right-tools {
  float: right;
  background-color: #fffacd;
  width: 100%;
  height: 35px;
}
.wrapper {
  background-size:
    21px 21px,
    21px 21px;
  overflow: scroll;
}
.screens {
  top: 50px;
  left: 100px;
}
.canvas {
  background-color: #fffacd;
  background-image: radial-gradient(#ff0000 1px, transparent 1px);
  background-size: 50px 50px;
  margin: 50px 50px;
  width: 900px;
  height: 700px;
  position: relative;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.item {
  width: 200px;
  background-color: red;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: move;
}

.chart-library {
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
}

.chart-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px dashed #ccc;
  cursor: move;
  display: flex;
  align-items: center;
}

.chart-item svg {
  margin-right: 8px;
}
</style>
