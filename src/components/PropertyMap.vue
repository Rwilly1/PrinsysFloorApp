<template>
  <div class="property-map" ref="mapContainer">
    <svg 
      viewBox="0 0 420 340" 
      class="map-svg"
      @wheel.prevent="handleWheel"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @touchstart="startPan"
      @touchmove="pan"
      @touchend="endPan"
    >
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#999" stroke-width="0.5"/>
        </pattern>
      </defs>
      
      <g class="floor-plan" :transform="transform">
        <rect x="10" y="10" width="400" height="320" fill="#fafafa" stroke="#000" stroke-width="3"/>
        
        <rect x="20" y="20" width="70" height="90" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="90" y="20" width="70" height="90" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="160" y="20" width="70" height="90" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="230" y="20" width="70" height="90" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="300" y="20" width="70" height="90" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="370" y="20" width="30" height="90" fill="white" stroke="#000" stroke-width="2.5"/>
        
        <rect x="20" y="110" width="30" height="100" fill="url(#hatch)" stroke="#000" stroke-width="2.5"/>
        <rect x="50" y="110" width="40" height="100" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="90" y="110" width="70" height="100" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="160" y="110" width="70" height="100" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="230" y="110" width="70" height="50" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="300" y="110" width="70" height="50" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="370" y="110" width="30" height="50" fill="white" stroke="#000" stroke-width="2.5"/>
        
        <rect x="230" y="160" width="70" height="50" fill="url(#hatch)" stroke="#000" stroke-width="2.5"/>
        <rect x="300" y="160" width="100" height="50" fill="url(#hatch)" stroke="#000" stroke-width="2.5"/>
        
        <rect x="20" y="210" width="140" height="110" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="160" y="210" width="70" height="110" fill="white" stroke="#000" stroke-width="2.5"/>
        <rect x="230" y="210" width="170" height="110" fill="white" stroke="#000" stroke-width="2.5"/>
        
        <text x="50" y="68" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}01</text>
        
        <text x="125" y="68" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}02</text>
        
        <text x="195" y="68" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}03</text>
        
        <text x="265" y="68" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}04</text>
        
        <text x="335" y="68" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}05</text>
        
        <text x="385" y="68" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}06</text>
        
        <text x="35" y="165" font-size="8" fill="#666" text-anchor="middle" transform="rotate(-90 35 165)">CORRIDOR</text>
        
        <text x="70" y="165" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}07</text>
        
        <text x="125" y="165" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}08</text>
        
        <text x="195" y="165" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}09</text>
        
        <text x="265" y="135" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}12</text>
        
        <text x="335" y="135" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}13</text>
        
        <text x="385" y="135" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}14</text>
        
        <text x="265" y="188" font-size="8" fill="#666" text-anchor="middle">STAIRS</text>
        <text x="335" y="188" font-size="8" fill="#666" text-anchor="middle">CORRIDOR</text>
        
        <text x="85" y="270" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}11</text>
        
        <text x="195" y="270" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}10</text>
        
        <text x="315" y="270" font-size="11" font-weight="600" fill="#000" text-anchor="middle">{{ floor }}15</text>
      </g>
      
      <g class="sensors" :transform="transform">
        <g 
          v-for="sensor in sensors" 
          :key="sensor.id"
          @click="$emit('sensor-click', sensor)"
          class="sensor-marker"
          :class="sensor.status"
        >
          <circle 
            :cx="sensor.x" 
            :cy="sensor.y" 
            :r="sensor.status === 'alert' ? '10' : '7'"
            :fill="sensor.status === 'alert' ? '#ff5252' : '#0873bb'"
            :stroke="sensor.status === 'alert' ? '#fff' : '#fff'"
            :stroke-width="sensor.status === 'alert' ? '2' : '1.5'"
            class="sensor-circle"
          />
          <circle 
            v-if="sensor.status === 'alert'"
            :cx="sensor.x" 
            :cy="sensor.y" 
            r="10"
            fill="none"
            stroke="#ff5252"
            stroke-width="2"
            opacity="0.5"
            class="sensor-pulse"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  floor: Number,
  sensors: Array
})

const emit = defineEmits(['sensor-click'])

defineExpose({
  zoomIn,
  zoomOut,
  resetZoom
})

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const startPoint = ref({ x: 0, y: 0 })
const mapContainer = ref(null)
const lastTapTime = ref(0)
const lastTapPosition = ref({ x: 0, y: 0 })
const doubleTapDelay = 300
const tapMoveThreshold = 10

const minScale = 0.5
const maxScale = 3
const zoomStep = 0.2

// SVG viewBox dimensions
const viewBoxWidth = 420
const viewBoxHeight = 340

const transform = computed(() => {
  return `translate(${translateX.value}, ${translateY.value}) scale(${scale.value})`
})

function constrainTranslation(x, y, currentScale) {
  // Get the container dimensions
  if (!mapContainer.value) return { x, y }
  
  const container = mapContainer.value
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  
  // Calculate the scaled dimensions
  const scaledWidth = containerWidth * currentScale
  const scaledHeight = containerHeight * currentScale
  
  // Calculate max translation to keep content within bounds
  const maxTranslateX = (scaledWidth - containerWidth) / 2
  const maxTranslateY = (scaledHeight - containerHeight) / 2
  
  // Constrain translation
  const constrainedX = Math.max(-maxTranslateX, Math.min(maxTranslateX, x))
  const constrainedY = Math.max(-maxTranslateY, Math.min(maxTranslateY, y))
  
  return { x: constrainedX, y: constrainedY }
}

function zoomIn() {
  if (scale.value < maxScale) {
    scale.value = Math.min(scale.value + zoomStep, maxScale)
  }
}

function zoomOut() {
  if (scale.value > minScale) {
    scale.value = Math.max(scale.value - zoomStep, minScale)
  }
}

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

function handleWheel(event) {
  const delta = event.deltaY > 0 ? -zoomStep : zoomStep
  const newScale = Math.max(minScale, Math.min(maxScale, scale.value + delta))
  
  if (newScale !== scale.value) {
    // Get mouse position relative to the SVG
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    // Calculate the point in the SVG coordinate system before zoom
    const pointBeforeZoomX = (mouseX - translateX.value) / scale.value
    const pointBeforeZoomY = (mouseY - translateY.value) / scale.value
    
    // Update scale
    scale.value = newScale
    
    // Calculate the point in the SVG coordinate system after zoom
    const pointAfterZoomX = pointBeforeZoomX * scale.value
    const pointAfterZoomY = pointBeforeZoomY * scale.value
    
    // Adjust translation to keep the point under the mouse cursor
    let newX = mouseX - pointAfterZoomX
    let newY = mouseY - pointAfterZoomY
    
    // Apply boundary constraints
    const constrained = constrainTranslation(newX, newY, scale.value)
    translateX.value = constrained.x
    translateY.value = constrained.y
  }
}

function handleDoubleTap(event, tapX, tapY) {
  const currentTime = new Date().getTime()
  const tapInterval = currentTime - lastTapTime.value
  
  // Check if taps are close together in position
  const dx = tapX - lastTapPosition.value.x
  const dy = tapY - lastTapPosition.value.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (tapInterval < doubleTapDelay && tapInterval > 0 && distance < tapMoveThreshold) {
    // Double tap detected
    event.preventDefault()
    
    // Calculate the point in the SVG coordinate system before zoom
    const pointBeforeZoomX = (tapX - translateX.value) / scale.value
    const pointBeforeZoomY = (tapY - translateY.value) / scale.value
    
    // Zoom in
    const newScale = Math.min(scale.value + zoomStep * 2, maxScale)
    scale.value = newScale
    
    // Calculate the point in the SVG coordinate system after zoom
    const pointAfterZoomX = pointBeforeZoomX * scale.value
    const pointAfterZoomY = pointBeforeZoomY * scale.value
    
    // Adjust translation to keep the point under the tap location
    let newX = tapX - pointAfterZoomX
    let newY = tapY - pointAfterZoomY
    
    // Apply boundary constraints
    const constrained = constrainTranslation(newX, newY, scale.value)
    translateX.value = constrained.x
    translateY.value = constrained.y
    
    lastTapTime.value = 0 // Reset to prevent triple tap
    return true // Double tap handled
  } else {
    lastTapTime.value = currentTime
    lastTapPosition.value = { x: tapX, y: tapY }
    return false // Not a double tap
  }
}

function startPan(event) {
  const point = getEventPoint(event)
  
  // Check for double tap on touch devices
  if (event.touches) {
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const tapX = point.x - rect.left
    const tapY = point.y - rect.top
    
    const isDoubleTap = handleDoubleTap(event, tapX, tapY)
    if (isDoubleTap) {
      return // Don't start panning on double tap
    }
  }
  
  isPanning.value = true
  startPoint.value = {
    x: point.x - translateX.value,
    y: point.y - translateY.value
  }
}

function pan(event) {
  if (!isPanning.value) return
  
  event.preventDefault()
  const point = getEventPoint(event)
  let newX = point.x - startPoint.value.x
  let newY = point.y - startPoint.value.y
  
  // Apply boundary constraints
  const constrained = constrainTranslation(newX, newY, scale.value)
  translateX.value = constrained.x
  translateY.value = constrained.y
}

function endPan() {
  isPanning.value = false
}

function getEventPoint(event) {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }
  }
  return {
    x: event.clientX,
    y: event.clientY
  }
}
</script>

<style scoped>
.property-map {
  flex: 1;
  background: #fafafa;
  padding: 0.75rem;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  touch-action: none;
}

.map-svg {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  pointer-events: all;
  cursor: grab;
}

.map-svg:active {
  cursor: grabbing;
}

.sensors {
  pointer-events: all;
}

.sensor-marker {
  cursor: pointer;
  pointer-events: all;
}

.sensor-marker:hover {
  opacity: 0.9;
}

.sensor-circle {
  pointer-events: all;
  transition: opacity 0.2s;
}

.sensor-marker.alert .sensor-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    r: 12;
    opacity: 0.6;
  }
  50% {
    r: 18;
    opacity: 0;
  }
  100% {
    r: 12;
    opacity: 0;
  }
}

@media (max-width: 375px) {
  .property-map {
    padding: 0.5rem;
  }
}
</style>
