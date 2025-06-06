<template>
  <div ref="chartEl" style="width:100%;height:100%"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const chartEl = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartEl.value) return
  
  chartInstance = echarts.init(chartEl.value)
  const options = getDefaultOptions()
  chartInstance.setOption(options)
}

const getDefaultOptions = () => {
  switch(props.type) {
    case 'pie':
      return {
        title: { text: '饼图示例' },
        series: [{ type: 'pie', data: [{value:335},{value:310},{value:234}] }]
      }
    case 'bar':
      return {
        xAxis: { data: ['A','B','C'] },
        yAxis: {},
        series: [{ type: 'bar', data: [5,20,36] }]
      }
    case 'line':
      return {
        xAxis: { data: ['Mon','Tue','Wed'] },
        yAxis: {},
        series: [{ type: 'line', data: [150,230,224] }]
      }
    default:
      return {}
  }
}

onMounted(() => {
  initChart()
})

watch(() => props.options, (newVal) => {
  if (chartInstance) {
    chartInstance.setOption(newVal)
  }
}, { deep: true })
</script>
