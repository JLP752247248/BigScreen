<template>
  <div class="designer-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar" style="width:100%;height: 40px;">
        <el-button-group style="float: left;width:400px">
          <el-button type="primary" @click="saveDesign" style="float: left;width:80px">保存</el-button>
          <el-button @click="clearCanvas" style="float: left;width:80px">清空</el-button>
          <el-button @click="exportImage" style="float: left;width:80px">导出图片</el-button>
        </el-button-group>
        <el-select v-model="canvasSize" placeholder="画布尺寸" style="float: right;width:100px">
          <el-option label="1920x1080" value="1920x1080" />
          <el-option label="1366x768" value="1366x768" />
        </el-select>
    </div>

    <!-- 主体区域 -->
    <div class="designer-body">
      <!-- 左侧图表库 -->
      <div class="chart-library" style="border-color: aqua">
        <el-tabs v-model="activeName" tab-position="left" style="" class="left-tabs-box"
          @tab-click="tabClick">
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

          <el-tab-pane v-for="menu in menuList" :key="menu.id" :name="menu.name" @click.stop="changeActiveCode('')"
            style="border-color: blueviolet">
            <template #label>
              <div class="menu-slot" @dblclick="toggleSidebar">
                <span class="menu-title-span">{{ menu.title }}</span>
              </div>
            </template>

            <el-scrollbar style="">
              <div v-for="comp in menu.components" :key="comp.id" :name="comp.name" draggable="true"
                @dragstart="handleDragStart($event, comp)">
                <el-image style="width: 150px;" :src="imageUrl" :fit="fit" />
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container">
        <SketchRule class="design-panel" 
        :scale="1" 
        :thick="30" 
        :startX="10" 
        :startY="10" 
        :horLineArr="[100, 200]"
        :verLineArr="[20, 40]" 
        :cornerActive="true" 
        @dragover.prevent 
        @drop="handleDrop" 
        @handleLine="handleLine">
          
        </SketchRule>

        <div class = "screen">
          <div v-for="(item, index) in canvasItems" :key="index" class="chart-container" :style="{
            width: item.width + 'px',
            height: item.height + 'px',
            left: item.x + 'px',
            top: item.y + 'px',
          }" draggable="true" @mousedown="startDragFromPanel($event, item)">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Close } from '@element-plus/icons-vue';
import EChartsWrapper from './EChartsWrapper.vue';
import SketchRule from 'vue3-sketch-ruler'
import 'vue3-sketch-ruler/lib/style.css';

// 设计面板上的图表项
const canvasItems = ref([]);
canvasItems.value = [];
const draggedItem = ref(null);
const canvasSize = ref('1920x1080');
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
        id: 99,
        width: 200,
        height: 200,
        type: 'line',
        name: 'line',
      },
      {
        id: 100,
        width: 200,
        height: 200,
        type: 'pie',
        name: 'pie',
      },
    ],
  },
  {
    id: 13,
    name: 'yyy',
    title: 'ccccccc',
  },
];
const imageUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
const dragType = ref([]);
const handleDragStart = (e, item) => {
  console.log(e);
  console.log(item);
  draggedItem.value = Object.assign({}, item);
  dragType.value = 'add';
};

const handleDrop = e => {
  console.log(e);
  const rect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;
  console.log(e.currentTarget);
  console.log(rect);
  draggedItem.value = Object.assign(draggedItem.value, { x: offsetX, y: offsetY });
  if (dragType.value == 'add') {
    canvasItems.value.push(draggedItem.value);
  }
  draggedItem.value = null;
};
const startDragFromPanel = (e, item) => {
  console.log(e);
  console.log(item);
  draggedItem.value = item;
  dragType.value = 'move';
};

const removeChart = index => {
  canvasItems.value.splice(index, 1);
};

const saveDesign = () => {
  console.log('保存设计:', canvasItems.value);
};

const clearCanvas = () => {
  canvasItems.value = [];
};

const exportImage = () => {
  // 实现导出逻辑
};
</script>

<style scoped>
@import 'vue3-sketch-ruler/lib/style.css';
html,body {
  overflow: hidden;
}
.designer-body {
  top: 50px;
  width: 100%;
  display: flex;
}
.container {
  flex: 1;
  height: 90%;
  background: #ddd;
  border-color: blue;
  position: relative;
  z-index: 998;
}
.chart-library {
  width: 300px;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.design-panel {
  width:3000px;
  height:3000px;
  position: absolute;
  background: rgb(53, 53, 78);
  z-index: 998;
}
.screen {
  width:90%;
  height:90%;
  padding: 30px 30px;
  position: absolute;
  background: rgb(33, 243, 14);
  overflow: scroll;
}
</style>
