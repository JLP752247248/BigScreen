<template>
  <div class="ruler-container">
    <!-- 横向标尺 -->
    <div class="horizontal-ruler" ref="hRuler">
      <canvas ref="hCanvas"></canvas>
    </div>
    
    <div class="content-area">
      <!-- 纵向标尺 -->
      <div class="vertical-ruler" ref="vRuler">
        <canvas ref="vCanvas"></canvas>
      </div>
      
      <!-- 主画布区域 -->
      <canvas 
        class="main-canvas" 
        ref="mainCanvas"
        @mousemove="handleMouseMove"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const hCanvas = ref(null)
const vCanvas = ref(null)
const mainCanvas = ref(null)
const mousePos = ref({ x: 0, y: 0 })

// 标尺参数
const rulerSize = 20
const step = 50

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', initCanvas)
})

function initCanvas() {
  const container = mainCanvas.value.parentElement.parentElement
  const width = container.clientWidth - rulerSize
  const height = container.clientHeight - rulerSize
  
  // 设置画布尺寸
  mainCanvas.value.width = width
  mainCanvas.value.height = height
  hCanvas.value.width = width
  hCanvas.value.height = rulerSize
  vCanvas.value.width = rulerSize
  vCanvas.value.height = height

  drawRulers()
  drawMainCanvas()
}

function drawRulers() {
  const hCtx = hCanvas.value.getContext('2d')
  const vCtx = vCanvas.value.getContext('2d')
  
  // 清空画布
  hCtx.clearRect(0, 0, hCanvas.value.width, hCanvas.value.height)
  vCtx.clearRect(0, 0, vCanvas.value.width, vCanvas.value.height)
  
  // 绘制横向标尺
  hCtx.strokeStyle = '#999'
  hCtx.fillStyle = '#333'
  hCtx.font = '10px Arial'
  
  for (let x = 350; x < hCanvas.value.width; x += step) {
    hCtx.beginPath()
    hCtx.moveTo(x, rulerSize)
    hCtx.lineTo(x, 0)
    hCtx.stroke()
    
    if (x % (step * 2) === 0) {
      hCtx.fillText(x.toString(), x + 2, rulerSize - 12)
    }
  }
  
  // 绘制纵向标尺
  vCtx.strokeStyle = '#999'
  vCtx.fillStyle = '#333'
  vCtx.font = '10px Arial'
  
  for (let y = 0; y < vCanvas.value.height; y += step) {
    vCtx.beginPath()
    vCtx.moveTo(rulerSize, y)
    vCtx.lineTo(rulerSize - 10, y)
    vCtx.stroke()
    
    if (y % (step * 2) === 0) {
      vCtx.save()
      vCtx.translate(8, y + 5)
      vCtx.rotate(-Math.PI/2)
      vCtx.fillText(y.toString(), 0, 0)
      vCtx.restore()
    }
  }
}

function drawMainCanvas() {
  const ctx = mainCanvas.value.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, mainCanvas.value.width, mainCanvas.value.height)
  
  // 绘制网格线
  ctx.strokeStyle = '#eee'
  for (let x = 0; x < mainCanvas.value.width; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, mainCanvas.value.height)
    ctx.stroke()
  }
  for (let y = 0; y < mainCanvas.value.height; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(mainCanvas.value.width, y)
    ctx.stroke()
  }
}

function handleMouseMove(e) {
  const rect = mainCanvas.value.getBoundingClientRect()
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  // 可以在这里添加鼠标位置指示线等交互功能
}
</script>

<style scoped>
.ruler-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.horizontal-ruler {
  height: 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.vertical-ruler {
  width: 20px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  float: left;
}

.content-area {
  display: flex;
}

.main-canvas {
  background: white;
  border: 1px solid #ddd;
  cursor: crosshair;
}
</style>