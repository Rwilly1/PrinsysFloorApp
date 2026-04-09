<template>
  <div class="property-map">
    <svg viewBox="0 0 420 340" class="map-svg">
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#999" stroke-width="0.5"/>
        </pattern>
      </defs>
      
      <g class="floor-plan">
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
      
      <g class="sensors">
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
defineProps({
  floor: Number,
  sensors: Array
})

defineEmits(['sensor-click'])
</script>

<style scoped>
.property-map {
  flex: 1;
  background: #fafafa;
  padding: 0.75rem;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-svg {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  pointer-events: all;
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
