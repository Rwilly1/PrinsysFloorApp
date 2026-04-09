export const alertState = {
  alerts: [],
  listeners: []
}

export function triggerAlert(sensorId, floor, room) {
  const alert = {
    id: Date.now(),
    sensorId,
    floor,
    room,
    timestamp: new Date().toISOString(),
    status: 'active'
  }
  
  alertState.alerts.push(alert)
  alertState.listeners.forEach(listener => listener(alert))
  
  return alert
}

export function clearAlert(alertId) {
  const index = alertState.alerts.findIndex(a => a.id === alertId)
  if (index !== -1) {
    alertState.alerts.splice(index, 1)
    alertState.listeners.forEach(listener => listener(null))
  }
}

export function subscribeToAlerts(callback) {
  alertState.listeners.push(callback)
  return () => {
    const index = alertState.listeners.indexOf(callback)
    if (index !== -1) {
      alertState.listeners.splice(index, 1)
    }
  }
}

if (typeof window !== 'undefined') {
  window.triggerAlert = triggerAlert
  window.clearAlert = clearAlert
  window.getAlerts = () => alertState.alerts
}
