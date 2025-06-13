<template>
  <div style="background-color: bisque; width: 100%; height: 100%">
    <div style="background-color: aqua; width: 100%; height: 40px; border-color: black; margin: 5px 5px"></div>
    <div class="maincontent">
      <div :class="toggle ?  'lefthide':'left' ">
        <el-tabs v-model="activeName" tab-position="left" class="left-tabs-box" @tab-click="tabClick">
           <el-tab-pane name="default" @click="changeActiveCode('')">
            <template #label>
              <span class="menu-slot" name="default" @click="toggleSidebar(!toggle)">
                <span class="menu-title-span">{{ toggle }}</span>
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane
            v-for="menu in menuList"
            :key="menu.id"
            :name="menu.name"
                        style="border-color: blueviolet">
            <template #label>
              <div class="menu-slot" @click="toggleSidebar(false)"> 
                <span class="menu-title-span">{{ menu.title }}</span>
              </div>
            </template>

            <el-scrollbar>
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
          <div class="zoom-controls" style="float: left">
            <button @click="zoomIn">放大 (+)</button>
            <button @click="zoomOut">缩小 (-)</button>
            <button @click="resetZoom">重置 (100%)</button>
          </div>
          <div style="float: left">当前缩放比例：{{ Math.round(rulerRef.scale * 100) }}%</div>
          <el-select v-model="selectedResolution" :label="分辨率" @change="updateDivSize" style="width: 200px; float: right">
            <el-option v-for="item in resolutions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <SketchRule  @handleLine="handleLine" :lines="snapLines"
          :palette="palette"
          :scale="rulerRef.scale"
          :thick="rulerRef.thick"
          :startX="computStartX"
          :startY="computStartX"
          :width="rulerRef.width"
          :height="rulerRef.height"
          :rate="rulerRef.rate"
          :autoCenter="false"
          :canvas-width="5200"
          :canvas-height="4200"
          :cornerActive="true"
          :showShadowText="false"
          :showRuler="true"
          :gridRatio="rulerRef.gridRatio"
          :innerHeight="50"
          :innerWidth="50"
         >
        </SketchRule>
        <div class="screens">
        <div
            id="dpanel"
            class="canvas"
            :style="{
              width: canvasStyle.width + 'px',
              height: canvasStyle.height + 'px',
            }"
            @dragover.prevent 
            @drop="handleDrop" 
            ref="zoomTarget"
          >
            <DraggableContainer adsorbParent="false">
              <Vue3DraggableResizable
                v-for="(item, index) in canvasItems"
                :key="index"
                class="chart-container selectable"
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
                :disable-lines="true" 
                :prevent-deactivation="false"
                @activated="print('activated')"
                @deactivated="print('deactivated')"
                @drag-start="print('drag-start')"
                @resize-start="print('resize-start')"
                @dragging="print('dragging')"
                @resizing="print('resizing')"
                @drag-end="print('drag-end')"
                @resize-end="size => handleResizeEnd(index, size)"
                :ref="registerRef"
                @mousedown="handleItemClick($event)"
                @mousemove="handleMove($event)"
                @mouseup="handleLeave($event)"
              >
                <EChartsWrapper :type="item.type" :width="item.width" :height="item.height"> </EChartsWrapper>
                <div class="chart-controls">
                  <el-icon @click="removeChart(index)">
                    <Close />
                  </el-icon>
                </div>
              </Vue3DraggableResizable>
            </DraggableContainer>
          </div>
          </div>
      </div>
      <div class="panel-tool"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import EChartsWrapper from './EChartsWrapper.vue';

import SketchRule from './vue3-sketch-rule/sketch-ruler/SketchRuler.vue';
import Vue3DraggableResizable from './vue3-draggable-resizable/Vue3DraggableResizable';
import DraggableContainer from 'vue3-draggable-resizable/src/components/DraggableContainer';

import panzoom from 'simple-panzoom';

const snapLines = ref({
  h: [], // 水平吸附线位置
  v: [], // 垂直吸附线位置
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
rulerRef.value= {
     "scale":1               ,
     "thick":"20"              ,
     "startX":-30            ,
     "startY":-30            ,
     "width":"5000"            ,
     "height":"4000"           ,
     "rate":"1"                ,
     "autoCenter":"false"      ,
     "canvas-width":"5200"     ,
     "canvas-height":"4200"    ,
     "cornerActive":"true"     ,
     "showShadowText":"false"  ,
     "showRuler":"true"        ,
     "gridRatio":"1"           ,
     "innerHeight":"50"        ,
     "innerWidth":"50"         ,
}
const computStartX = computed(() => -30/rulerRef.value.scale);
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
const testcomparr= [
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
      {
        id: 96,
        type: 'pie',
        width: 400,
        height: 200,
        name: 'pie',
        x: 400,
        y: 500,
      },
      {
        id: 95,
        type: 'pie',
        width: 400,
        height: 200,
        name: 'pie',
        x: 400,
        y: 500,
      },
    ];
const menuList = [
  {
    id: 12,
    name: '图表',
    title: '图表',
    components: testcomparr
  },
  {
    id: 13,
    name: '表格',
    title: '表格',
    components: testcomparr
  },
  {
    id: 14,
    name: '装饰',
    title: '装饰',
    components: testcomparr
  },
  {
    id: 15,
    name: '组件',
    title: '组件',
    components: testcomparr
  },
  {
    id: 16,
    name: '图层',
    title: '图层',
    components: testcomparr
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

const isDragging = ref(false);
const toggle = ref(true);
const handleItemClick = (e) => {
    isDragging.value=true;
    handleMove(e);
};
const changeActiveCode = () => {
    alert(11);
};
const toggleSidebar = (aim) => {
    toggle.value =aim;
    
    setTimeout(() => {
        activeName.value= currActiveName.value;
      })
};
const handleMove = (e) => {
    if(isDragging.value===false){
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = document.getElementById('dpanel');
    const parentRect = parent.getBoundingClientRect();
    snapLines.value = {
      h: [(rect.top-parentRect.top)/rulerRef.value.scale, (rect.bottom-parentRect.top)/rulerRef.value.scale]  , // 水平吸附线位置
      v: [(rect.left-parentRect.left)/rulerRef.value.scale,(rect.right-parentRect.left)/rulerRef.value.scale]     // 垂直吸附线位置
    };
    console.log(snapLines.value);
};
const handleLeave = (e) => {
     isDragging.value=false;
    snapLines.value = {
      h: []  , // 水平吸附线位置
      v: []     // 垂直吸附线位置
    };
};
const print = val => {
  console.log(val);
};
const activeName = ref('表格');
const currActiveName = ref('表格');
const tabClick = (tab) => {
      console.log('tab')
      console.log(tab)
      console.log('activeName')
      console.log(activeName.value)
      if (tab.index !== '0') {
        toggle.value = false
        currActiveName.value = tab.props.name
      }

};

const handleResizeEnd = (index, size) => {
  //console.log(size)
  //console.log(index)

  //console.log( canvasItems.value[index])
  canvasItems.value[index].width = size.w;
  canvasItems.value[index].height = size.h;
};
const draggableRefs = ref([]);
const registerRef = el => {
  if (el) draggableRefs.value.push(el);
  // console.log(draggableRefs)
};

const handleDrop = e => {
  console.log(e);
  const rect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  // console.log(e.currentTarget);
  //console.log(rect);
  if (!draggedItem.value) {
    return;
  }
  draggedItem.value = Object.assign(draggedItem.value, { x: offsetX, y: offsetY });
  if (dragType.value == 'add') {
    canvasItems.value.push(draggedItem.value);
  }
  draggedItem.value = null;
};


const zoomTarget = ref(null); // 缩放目标元素
let panzoomInstance = null; // panzoom 实例
// 初始化 panzoom
onMounted(() => {
    panzoomInstance = panzoom(zoomTarget.value, {
      excludeClass: 'selectable', // 添加此class的元素可正常响应点击
    minZoom: 0.1, // 最小缩放比例
    maxZoom: 10, // 最大缩放比例
    origin: '0 0', // 关键！固定左上角为缩放原点
    zoomSpeed: 0.2, // 缩放速度
    disablePan: true
  });
});

// 放大
const zoomIn = () => {
  rulerRef.value.scale = rulerRef.value.scale <= 1.6 ? rulerRef.value.scale + 0.2 : rulerRef.value.scale;
  panzoomInstance.zoom(rulerRef.value.scale); // 放大 20%
};
// 缩小
const zoomOut = () => {
  rulerRef.value.scale = rulerRef.value.scale >= 0.4 ? rulerRef.value.scale - 0.2 : rulerRef.value.scale;

  panzoomInstance.zoom(rulerRef.value.scale); // 缩小 20%
};
// 重置
const resetZoom = () => {
  rulerRef.value.scale = 1;
  panzoomInstance.reset(); // 恢复原始大小
};
</script>
<style scoped>
@import 'vue3-sketch-ruler/lib/style.css';
.maincontent {
  width: 100%;
  height: calc(100% - 40px);
  border-color: black;
  margin: 5px 5px;
  display: flex;
}
.left {
  float: left;
  height: 100%;
  background-color: beige;
  display: flex;
  overflow: hidden;
  margin-right: 5px;
}
.lefthide {
  float: left;
  width: 80px;
  height: 100%;
  background-color: beige;
  display: flex;
  overflow: hidden;
  margin-right: 5px;
}
.right {
  float: left;
  flex: 1;

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
  overflow: hidden;
  position: relative;
  top: 35px;
}
.screens {
  position: absolute;
  top: 55px;
  left: 20px;
  width: 1000px;
  height: 600px;
      background-color: #1d1d1c; /* 浅黄色背景 */
    background-image: radial-gradient(hsl(0, 54%, 97%) 1px, transparent 1px); /* 红色点 */
    background-size: 20px 20px; /* 点间距 */
    overflow: scroll !important;
    z-index: 102;
}
.canvas {
  background-color: #fffacd;
  background-image: radial-gradient(#ff0000 1px, transparent 1px);
  background-size: 50px 50px;
  margin: 50px 50px;
  width: 900px;
  height: 700px;
  position: absolute;
  background: #302d2d;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
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

.chart-container{
  will-change: transform;
}
.panel-tool{
  width: 300px;
  height: 100%;
  background-color: #fffacd;
}
</style>
