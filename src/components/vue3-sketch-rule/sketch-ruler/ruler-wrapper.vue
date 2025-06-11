<template>
  <div :class="rwClassName">
    <CanvasRuler v-bind="$props" @handle-drag-start="mousedown" />
    <div v-show="isShowReferLine" class="lines">
      <RulerLine
        v-for="(v, i) in cpuLines"
        :key="v + i"
        :index="i"
        :value="v >> 0"
        v-bind="$props"
      />
    </div>

    <div
      v-if="isShowReferLine"
      v-show="isdragle"
      class="indicator"
      :style="indicatorStyle"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseLeave"
    >
      <div class="action" :style="actionStyle">
        <span v-if="showLabel" class="value">{{ labelContent }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RulerLine from './ruler-line.vue'
import CanvasRuler from '../canvas-ruler/CanvasRuler.vue'
import { ref, computed, watch } from 'vue'
import useLine from './useLine' // 引入自定义hook
import type { FinalPaletteType, LineType } from '../index-types'
const props = defineProps<{
  scale: number
  thick: number
  canvasWidth: number
  canvasHeight: number
  palette: FinalPaletteType
  vertical: boolean
  width: number
  height: number
  start: number
  startOther: number
  lines: LineType
  selectStart: number
  selectLength: number
  isShowReferLine: boolean
  rate: number
  snapThreshold: number
  snapsObj: LineType
  gridRatio: number
  lockLine: boolean
  showShadowText: boolean
}>()

const {
  showLabel,
  actionStyle,
  handleMouseenter,
  handleMouseLeave,
  handleMouseDown,
  labelContent,
  startValue
} = useLine(props, !props.vertical)
const isLockLine = ref(false)
const isdragle = ref(false)

const rwClassName = computed(() => {
  const className = props.vertical ? 'v-container' : 'h-container'
  return className
})
const emit = defineEmits(['changeLineState'])

const cpuLines = computed(() => {
  return props.vertical ? props.lines?.h : props.lines?.v
})

const indicatorStyle = computed(() => {
  const lineType = props.palette.lineType
  let positionKey = props.vertical ? 'left' : 'top'
  let gepKey = props.vertical ? 'top' : 'left'
  let boderKey = props.vertical ? 'borderLeft' : 'borderBottom'
  const offsetPx = (startValue.value - props.startOther) * props.scale + props.thick
  return {
    [positionKey]: offsetPx + 'px',
    [gepKey]: -props.thick + 'px',
    cursor: props.vertical ? 'ew-resize' : 'ns-resize',
    [boderKey]: `1px ${lineType} ${props.palette.lineColor}`
  }
})

/**
 * @description: 指示器按下时
 * @param {*} e
 */
const mousedown = async (e: MouseEvent) => {
  const { offsetX, offsetY } = e
  const { scale, vertical, thick, startOther } = props
  if (!isLockLine.value) {
    isdragle.value = true

    emit('changeLineState', false)
    let tempStartValue = Math.round(
      startOther - thick / scale + (vertical ? offsetX : offsetY) / scale
    )
    startValue.value = tempStartValue
    await handleMouseDown(e, tempStartValue)
    isdragle.value = false
  }
}

watch([() => props.lockLine], () => {
  isLockLine.value = props.lockLine
})
</script>

