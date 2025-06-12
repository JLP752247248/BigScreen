
<template>
  <div>
    <canvas ref="canvas" width="600" height="300"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const canvas = ref(null);

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  
  // 1px细红线（像素对齐处理）
  ctx.beginPath();
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 1;
  ctx.moveTo(50.5, 50.5);
  ctx.lineTo(550.5, 50.5);
  ctx.stroke();

  // 3px标准红线
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.moveTo(50, 100);
  ctx.lineTo(550, 100);
  ctx.stroke();

  // 10px粗红线（圆角端点）
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.moveTo(50, 150);
  ctx.lineTo(550, 150);
  ctx.stroke();

  // 20px渐变红线
  const gradient = ctx.createLinearGradient(50, 200, 550, 200);
  gradient.addColorStop(0, 'rgba(255,0,0,1)');
  gradient.addColorStop(1, 'rgba(150,0,0,1)');
  
  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 20;
  ctx.moveTo(50, 200);
  ctx.lineTo(550, 200);
  ctx.stroke();
});
</script>

<style scoped>
canvas {
  border: 1px solid #eee;
  margin: 20px;
}
</style>
