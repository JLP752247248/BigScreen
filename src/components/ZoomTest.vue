<template>
  <div class="container">
    <!-- 缩放目标区域（固定左上角） -->
    <div ref="zoomTarget" class="zoom-target">
      <div class="content">
        <h2>缩放区域（左上角固定）</h2>
        <p>点击下方按钮缩放，内容会向右下方扩展</p>
      </div>
    </div>

    <!-- 缩放控制按钮 -->
    <div class="controls">
      <button @click="zoomIn">放大 (+)</button>
      <button @click="zoomOut">缩小 (-)</button>
      <button @click="reset">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import panzoom from 'simple-panzoom';
const zoomTarget = ref(null); // 缩放目标元素
let panzoomInstance = null;   // panzoom 实例
const scale = ref(1)
// 初始化 panzoom
onMounted(() => {
  panzoomInstance = panzoom(zoomTarget.value, {
    minZoom: 0.1,    // 最小缩放比例
    maxZoom: 10,      // 最大缩放比例
    origin: '0 0',   // 关键！固定左上角为缩放原点
    zoomSpeed: 0.2,  // 缩放速度
    filterKey: () => false,
        disablePan: true,

    beforeWheel: (e) => {
    // 拦截所有滚轮事件
    return false
  }
  });
    // 滚轮事件处理（已内置，此处为备用方案）

});

// 放大
const zoomIn = () => {
  scale.value =scale.value*1.2
  panzoomInstance.zoom(scale.value); // 放大 20%
}
// 缩小
const zoomOut = () => {
    scale.value =scale.value*0.8

  panzoomInstance.zoom(scale.value); // 缩小 20%
}
// 重置
const reset = () => panzoomInstance.reset(); // 恢复原始大小
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 缩放目标区域 */
.zoom-target {
  width: fit-content;
  height: fit-content;
  transform-origin: 0 0; /* CSS 辅助固定左上角 */
  border: 1px solid #ccc;
  margin: 20px;
}

/* 内容样式 */
.content {
  padding: 40px;
  background: #f5f5f5;
}

/* 按钮控制区 */
.controls {
  padding: 10px;
  display: flex;
  gap: 10px;
}
button {
  padding: 8px 12px;
  cursor: pointer;
}
</style>
