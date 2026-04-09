# PrinsysFloorApp

A Vue 3 prototype for monitoring water leakage sensors across multiple building floors.

## Features

- **Multi-Floor Navigation**: Browse floors 1-8 with up/down arrows
- **Interactive Floor Maps**: Visual property blueprints with sensor locations
- **Alert System**: Real-time leak detection alerts with visual indicators
- **Sensor Monitoring**: Random 3-21 sensors per floor with unique random IDs
- **Backend Alert Triggers**: API endpoints to trigger alerts programmatically

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. (Optional) Run backend alert API server:
```bash
npm run server
```

## Usage

### Frontend
- Navigate to `http://localhost:3000`
- Click "FloorMap" in bottom navigation
- Use up/down arrows to switch between floors 1-8
- Room numbers automatically reflect the floor (e.g., Floor 1: 101-106, Floor 3: 301-306)
- Click sensors to view popup with quick actions
  - Click "Check Details" to see individual sensor information, alert details, and activity history
  - Click "Report Issue" to submit a problem report
- Click "Check Details" button (bottom) to view floor-level sensor summary
- Click X on alert banner to toggle alert state

### Backend Alert Triggers

You can trigger alerts from the browser console:

```javascript
// Trigger an alert for a specific sensor
window.triggerAlert('304', 3, 'Bathroom')

// Get all active alerts
window.getAlerts()

// Clear an alert by ID
window.clearAlert(alertId)
```

Or use the API server (if running):

```bash
# Trigger alert
curl -X POST http://localhost:3001/api/alerts/trigger \
  -H "Content-Type: application/json" \
  -d '{"sensorId":"304","floor":3,"room":"Bathroom"}'

# Get all alerts
curl http://localhost:3001/api/alerts

# Clear alert
curl -X POST http://localhost:3001/api/alerts/clear/{alertId}
```

## Project Structure

- `src/` - Source files
  - `views/` - Page components
    - `FloorMap.vue` - Main floor map view
  - `components/` - Reusable components
    - `PropertyMap.vue` - SVG floor plan with sensors
  - `api/` - API utilities
    - `alerts.js` - Alert management system
  - `App.vue` - Root component with navigation
  - `main.js` - Application entry point
- `server.js` - Express API server for backend alerts
- `index.html` - HTML template
- `vite.config.js` - Vite configuration

## Tech Stack

- Vue 3 (Composition API)
- Vue Router
- Vite
- Express (Backend API)
- SVG for floor maps
