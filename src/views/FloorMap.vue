<template>
  <div class="floor-map-view">
    <div class="page-header">
      <h1>Property Blueprint</h1>
      <p>{{ hasAlert ? 'View sensors installed across this property.' : 'No abnormal moisture levels detected.' }}</p>
    </div>

    <div :class="['alert-banner', hasAlert ? 'alert' : 'normal']">
      <div class="alert-content">
        <svg v-if="hasAlert" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span v-if="hasAlert">Alert: Active Leak Detected</span>
        <span v-else>System Status: Sensor Operating Normally</span>
      </div>
      <button class="close-btn" @click="toggleAlert">×</button>
    </div>

    <div class="map-header">
      <div class="map-title">
        <span>Floor Map</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="location">Tekniikantie 14, 02150 Espoo, Finland</div>
    </div>

    <div class="floor-selector">
      <button @click="previousFloor" :disabled="currentFloor <= 1" class="floor-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
      <div class="floor-display">Floor {{ currentFloor }}</div>
      <button @click="nextFloor" :disabled="currentFloor >= 8" class="floor-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>

    <PropertyMap 
      :floor="currentFloor" 
      :sensors="currentFloorSensors"
      @sensor-click="handleSensorClick"
    />

    <div class="map-actions">
      <button @click="openDetailsModal" class="action-btn secondary">Check Details</button>
      <button @click="openReportModal" class="action-btn primary">Report Issues</button>
    </div>

    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Floor {{ currentFloor }} Details</h2>
          <button class="modal-close" @click="closeDetailsModal">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>Sensor Summary</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ currentFloorSensors.length }}</div>
                <div class="stat-label">Total Sensors</div>
              </div>
              <div class="stat-card alert">
                <div class="stat-value">{{ currentFloorSensors.filter(s => s.status === 'alert').length }}</div>
                <div class="stat-label">Active Alerts</div>
              </div>
              <div class="stat-card normal">
                <div class="stat-value">{{ currentFloorSensors.filter(s => s.status === 'normal').length }}</div>
                <div class="stat-label">Normal</div>
              </div>
            </div>
          </div>
          <div class="detail-section">
            <h3>Sensor List</h3>
            <div class="sensor-list">
              <div 
                v-for="sensor in currentFloorSensors" 
                :key="sensor.id"
                class="sensor-item"
                :class="sensor.status"
              >
                <div class="sensor-info">
                  <span class="sensor-id">{{ sensor.id }}</span>
                  <span class="sensor-room">{{ sensor.room }}</span>
                </div>
                <div class="sensor-status-badge" :class="sensor.status">
                  {{ sensor.status === 'alert' ? 'ALERT' : 'NORMAL' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showReportModal" class="modal-overlay" @click="closeReportModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Report Issue</h2>
          <button class="modal-close" @click="closeReportModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitReport" class="report-form">
            <div class="form-group">
              <label for="issue">Issue Type</label>
              <select id="issue" v-model="reportForm.issue" required>
                <option value="">Select issue type</option>
                <option value="leak">Water Leak</option>
                <option value="sensor-malfunction">Sensor Malfunction</option>
                <option value="false-alarm">False Alarm</option>
                <option value="maintenance">Maintenance Required</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                v-model="reportForm.description" 
                rows="4" 
                placeholder="Describe the issue in detail..."
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" v-model="reportForm.priority" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeReportModal" class="action-btn secondary">Cancel</button>
              <button type="submit" class="action-btn primary">Submit Report</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="selectedSensor" class="sensor-popup" :class="selectedSensor.status" @click.stop>
      <button class="popup-close" @click.stop="selectedSensor = null">×</button>
      <div class="popup-header">
        <svg v-if="selectedSensor.status === 'alert'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <div class="popup-title">Sensor #{{ selectedSensor.id }}</div>
          <div class="popup-subtitle">{{ selectedSensor.room }}</div>
          <div class="popup-status">{{ selectedSensor.status === 'alert' ? 'Alert Issued' : 'Normal Activity' }}</div>
        </div>
      </div>
      <div class="popup-actions">
        <button class="popup-btn" @click.stop="openSensorDetailsModal()">Check Details</button>
        <button class="popup-btn" @click.stop="openReportModal(); selectedSensor = null">Report Issue</button>
      </div>
    </div>
    
    <div v-if="showSensorDetailsModal && selectedSensor" class="modal-overlay" @click="closeSensorDetailsModal(); selectedSensor = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Sensor #{{ selectedSensor.id }} Details</h2>
          <button class="modal-close" @click="closeSensorDetailsModal(); selectedSensor = null">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>Sensor Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Sensor ID:</span>
                <span class="info-value">{{ selectedSensor.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location:</span>
                <span class="info-value">{{ selectedSensor.room }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Floor:</span>
                <span class="info-value">{{ currentFloor }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="sensor-status-badge" :class="selectedSensor.status">
                  {{ selectedSensor.status === 'alert' ? 'ALERT' : 'NORMAL' }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedSensor.status === 'alert'">
            <h3>Alert Information</h3>
            <div class="alert-info">
              <div class="alert-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                </svg>
                <div>
                  <div class="alert-title">Water Leak Detected</div>
                  <div class="alert-desc">Moisture levels exceed normal threshold</div>
                </div>
              </div>
              <div class="alert-meta">
                <div class="meta-item">
                  <span class="meta-label">Detected:</span>
                  <span class="meta-value">{{ new Date().toLocaleTimeString() }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Severity:</span>
                  <span class="meta-value severity-high">High</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Activity History</h3>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-dot" :class="selectedSensor.status"></div>
                <div class="activity-content">
                  <div class="activity-title">{{ selectedSensor.status === 'alert' ? 'Alert triggered' : 'Status check: Normal' }}</div>
                  <div class="activity-time">{{ new Date().toLocaleString() }}</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot normal"></div>
                <div class="activity-content">
                  <div class="activity-title">Routine sensor check completed</div>
                  <div class="activity-time">{{ new Date(Date.now() - 3600000).toLocaleString() }}</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot normal"></div>
                <div class="activity-content">
                  <div class="activity-title">Moisture level: Normal (12%)</div>
                  <div class="activity-time">{{ new Date(Date.now() - 7200000).toLocaleString() }}</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot normal"></div>
                <div class="activity-content">
                  <div class="activity-title">Daily maintenance check passed</div>
                  <div class="activity-time">{{ new Date(Date.now() - 86400000).toLocaleString() }}</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot normal"></div>
                <div class="activity-content">
                  <div class="activity-title">Sensor calibration completed</div>
                  <div class="activity-time">{{ new Date(Date.now() - 172800000).toLocaleString() }}</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-dot normal"></div>
                <div class="activity-content">
                  <div class="activity-title">System initialized</div>
                  <div class="activity-time">{{ new Date(Date.now() - 604800000).toLocaleString() }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="action-btn secondary" @click="closeSensorDetailsModal(); selectedSensor = null">Close</button>
            <button class="action-btn primary" @click="closeSensorDetailsModal(); openReportModal()">Report Issue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PropertyMap from '../components/PropertyMap.vue'

const currentFloor = ref(1)
const hasAlert = ref(true)
const selectedSensor = ref(null)
const showDetailsModal = ref(false)
const showSensorDetailsModal = ref(false)
const showReportModal = ref(false)
const reportForm = ref({
  issue: '',
  description: '',
  priority: 'medium'
})

const floorData = ref({
  1: generateSensors(1),
  2: generateSensors(2),
  3: generateSensors(3),
  4: generateSensors(4),
  5: generateSensors(5),
  6: generateSensors(6),
  7: generateSensors(7),
  8: generateSensors(8)
})

function generateSensors(floor) {
  const sensors = []
  
  const units = [
    { room: `${floor}01`, positions: [{ x: 40, y: 50 }, { x: 60, y: 65 }, { x: 50, y: 80 }] },
    { room: `${floor}02`, positions: [{ x: 110, y: 50 }, { x: 130, y: 65 }, { x: 120, y: 80 }] },
    { room: `${floor}03`, positions: [{ x: 180, y: 50 }, { x: 200, y: 65 }, { x: 190, y: 80 }] },
    { room: `${floor}04`, positions: [{ x: 250, y: 50 }, { x: 270, y: 65 }, { x: 260, y: 80 }] },
    { room: `${floor}05`, positions: [{ x: 320, y: 50 }, { x: 340, y: 65 }, { x: 330, y: 80 }] },
    { room: `${floor}06`, positions: [{ x: 385, y: 50 }, { x: 385, y: 70 }] },
    { room: `${floor}07`, positions: [{ x: 60, y: 145 }, { x: 75, y: 165 }] },
    { room: `${floor}08`, positions: [{ x: 115, y: 145 }, { x: 135, y: 165 }] },
    { room: `${floor}09`, positions: [{ x: 185, y: 145 }, { x: 205, y: 165 }] },
    { room: `${floor}10`, positions: [{ x: 180, y: 250 }, { x: 200, y: 270 }] },
    { room: `${floor}11`, positions: [{ x: 70, y: 250 }, { x: 90, y: 270 }] },
    { room: `${floor}12`, positions: [{ x: 255, y: 125 }, { x: 275, y: 140 }] },
    { room: `${floor}13`, positions: [{ x: 325, y: 125 }, { x: 345, y: 140 }] },
    { room: `${floor}14`, positions: [{ x: 385, y: 125 }, { x: 385, y: 145 }] },
    { room: `${floor}15`, positions: [{ x: 300, y: 250 }, { x: 330, y: 270 }] }
  ]
  
  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }
  
  let alertCount = 0
  const maxAlerts = 3
  
  const alertIndices = new Set()
  while (alertIndices.size < maxAlerts) {
    alertIndices.add(Math.floor(Math.random() * 30))
  }
  
  let sensorIndex = 0
  units.forEach(unit => {
    const sensorsInUnit = Math.floor(Math.random() * 2) + 1
    
    for (let i = 0; i < Math.min(sensorsInUnit, unit.positions.length); i++) {
      const isAlert = alertIndices.has(sensorIndex) && alertCount < maxAlerts
      if (isAlert) alertCount++
      
      sensors.push({
        id: generateUniqueId(),
        x: unit.positions[i].x,
        y: unit.positions[i].y,
        status: isAlert ? 'alert' : 'normal',
        room: `Room ${unit.room}`
      })
      sensorIndex++
    }
  })
  
  return sensors
}

const currentFloorSensors = computed(() => floorData.value[currentFloor.value] || [])

function previousFloor() {
  if (currentFloor.value > 1) {
    currentFloor.value--
    updateAlertStatus()
  }
}

function nextFloor() {
  if (currentFloor.value < 8) {
    currentFloor.value++
    updateAlertStatus()
  }
}

function updateAlertStatus() {
  hasAlert.value = currentFloorSensors.value.some(s => s.status === 'alert')
}

function toggleAlert() {
  const alertSensors = currentFloorSensors.value.filter(s => s.status === 'alert')
  const normalSensors = currentFloorSensors.value.filter(s => s.status === 'normal')
  
  if (hasAlert.value && alertSensors.length > 0) {
    alertSensors.forEach(s => s.status = 'normal')
    hasAlert.value = false
  } else if (!hasAlert.value && normalSensors.length > 0) {
    const randomSensors = normalSensors.slice(0, 3)
    randomSensors.forEach(s => s.status = 'alert')
    hasAlert.value = true
  }
}

function handleSensorClick(sensor) {
  selectedSensor.value = sensor
}

function openDetailsModal() {
  showDetailsModal.value = true
}

function closeDetailsModal() {
  showDetailsModal.value = false
}

function openSensorDetailsModal() {
  showSensorDetailsModal.value = true
}

function closeSensorDetailsModal() {
  showSensorDetailsModal.value = false
}

function openReportModal() {
  showReportModal.value = true
}

function closeReportModal() {
  showReportModal.value = false
  reportForm.value = {
    issue: '',
    description: '',
    priority: 'medium'
  }
}

function submitReport() {
  console.log('Report submitted:', reportForm.value)
  alert(`Issue reported: ${reportForm.value.issue}\nPriority: ${reportForm.value.priority}`)
  closeReportModal()
}
</script>

<style scoped>
.floor-map-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
}

.page-header {
  padding: 1rem;
  background: white;
  flex-shrink: 0;
}

.page-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

.alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  flex-shrink: 0;
}

.alert-banner.alert {
  background: #ff5252;
  color: white;
}

.alert-banner.normal {
  background: #4caf50;
  color: white;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-header {
  padding: 0.875rem 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.map-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.location {
  color: #666;
  font-size: 0.8rem;
}

.floor-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.75rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.floor-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.floor-btn:hover:not(:disabled) {
  background: #0873bb;
  border-color: #0873bb;
  color: white;
}

.floor-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.floor-display {
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50;
  min-width: 100px;
  text-align: center;
}

.map-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  justify-content: flex-end;
  background: white;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.action-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.secondary {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.action-btn.primary {
  background: #0873bb;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sensor-popup {
  position: fixed;
  bottom: 80px;
  left: 1rem;
  right: 1rem;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1500;
  animation: slideUp 0.3s ease-out;
  max-width: 500px;
  margin: 0 auto;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.sensor-popup.alert {
  background: #ff5252;
  color: white;
}

.sensor-popup.normal {
  background: #4caf50;
  color: white;
}

.popup-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.popup-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.popup-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.popup-status {
  font-size: 0.8rem;
  opacity: 0.85;
  margin-top: 0.25rem;
  font-weight: 500;
}

.popup-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.popup-btn {
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.popup-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.popup-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.popup-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.popup-btn:active {
  transform: translateY(0);
}

.popup-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.popup-close:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: scale(1.1);
}

@media (max-width: 375px) {
  .page-header h1 {
    font-size: 1.1rem;
  }
  
  .page-header p {
    font-size: 0.8rem;
  }
  
  .alert-banner {
    font-size: 0.8rem;
    padding: 0.75rem 0.875rem;
  }
  
  .floor-selector {
    gap: 1rem;
  }
  
  .floor-btn {
    width: 32px;
    height: 32px;
  }
  
  .map-actions {
    padding: 0.75rem;
  }
}

@media (min-width: 768px) {
  .floor-map-view {
    max-width: 768px;
    margin: 0 auto;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card.alert {
  background: #ffebee;
}

.stat-card.normal {
  background: #e8f5e9;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-card.alert .stat-value {
  color: #ff5252;
}

.stat-card.normal .stat-value {
  color: #4caf50;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sensor-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.sensor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 6px;
  border-left: 3px solid transparent;
}

.sensor-item.alert {
  border-left-color: #ff5252;
  background: #ffebee;
}

.sensor-item.normal {
  border-left-color: #4caf50;
  background: #e8f5e9;
}

.sensor-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sensor-id {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.sensor-room {
  font-size: 0.8rem;
  color: #666;
}

.sensor-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sensor-status-badge.alert {
  background: #ff5252;
  color: white;
}

.sensor-status-badge.normal {
  background: #4caf50;
  color: white;
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0873bb;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

@media (max-width: 375px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-height: 90vh;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 600;
}

.alert-info {
  background: #ffebee;
  border-left: 3px solid #ff5252;
  padding: 1rem;
  border-radius: 6px;
}

.alert-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.alert-title {
  font-weight: 600;
  color: #c62828;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.alert-desc {
  font-size: 0.85rem;
  color: #666;
}

.alert-meta {
  display: flex;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #ffcdd2;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 0.85rem;
  color: #2c3e50;
  font-weight: 600;
}

.severity-high {
  color: #ff5252;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

.activity-dot.alert {
  background: #ff5252;
}

.activity-dot.normal {
  background: #4caf50;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #999;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 375px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .alert-meta {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
