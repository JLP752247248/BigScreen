
<template>
  <div class="designer-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-button-group>
        <el-button type="primary" @click="saveDesign">保存</el-button>
        <el-button @click="clearCanvas">清空</el-button>
        <el-button @click="exportImage">导出图片</el-button>
      </el-button-group>
      <div class="tool-right">
        <el-select v-model="canvasSize" placeholder="画布尺寸">
          <el-option label="1920x1080" value="1920x1080" />
          <el-option label="1366x768" value="1366x768" />
        </el-select>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="designer-body">
      <!-- 左侧图表库 -->
      <div class="chart-library">
        <div 
          v-for="chart in chartTypes" 
          :key="chart.type"
          class="chart-item"
          draggable="true"
          @dragstart="dragStart(chart)"
        >
          <component :is="chart.icon" />
          <span>{{ chart.name }}</span>
        </div>
      </div>

      <!-- 右侧设计面板 -->
      <div 
        class="design-panel"
        @dragover.prevent
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
            top: item.y + 'px'
          }"
          draggable="true"
          @mousedown="startDrag(item, $event)"
        >
          <component :is="getChartComponent(item.type)" />
          <div class="chart-controls">
            <el-icon @click="removeChart(index)"><Close /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  PieChart, 
  Histogram, 
  LineChart,
  Close
} from '@element-plus/icons-vue'
import EChartsWrapper from './EChartsWrapper.vue'

// 可用图表类型
const chartTypes = [
  { type: 'pie', name: '饼图', icon: PieChart },
  { type: 'bar', name: '柱状图', icon: Histogram },
  { type: 'line', name: '折线图', icon: LineChart }
]

// 设计面板上的图表项
const canvasItems = ref([])
const draggedItem = ref(null)
const canvasSize = ref('1920x1080')

const dragStart = (chart) => {
  draggedItem.value = {
    type: chart.type,
    x: 0,
    y: 0,
    width: 300,
    height: 200
  }
}


const startDrag = (chart) => {
  draggedItem.value = {
    type: chart.type,
    x: 0,
    y: 0,
    width: 300,
    height: 200
  }
}

const handleDrop = (e) => {
  if (draggedItem.value) {
    const rect = e.target.getBoundingClientRect()
    const newItem = {
      ...draggedItem.value,
      x: e.clientX - rect.left - draggedItem.value.width/2,
      y: e.clientY - rect.top - draggedItem.value.height/2
    }
    canvasItems.value.push(newItem)
    draggedItem.value = null
  }
}

const getChartComponent = () => {
  return EChartsWrapper
}

const removeChart = (index) => {
  canvasItems.value.splice(index, 1)
}

const saveDesign = () => {
  console.log('保存设计:', canvasItems.value)
}

const clearCanvas = () => {
  canvasItems.value = []
}

const exportImage = () => {
  // 实现导出逻辑
}
</script>

<style scoped>
.designer-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.toolbar {
  padding: 10px;
  background: #f5f7fa;
  display: flex;
  justify-content: space-between;
}
.designer-body {
  display: flex;
  flex: 1;
  overflow: hidden;
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
.design-panel {
  flex: 1;
  position: relative;
  background: #f9f9f9;
  overflow: hidden;
}
.chart-container {
  position: absolute;
  border: 1px solid #ddd;
  background: white;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}
.chart-controls {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
</style>
