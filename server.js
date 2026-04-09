import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const alerts = []

app.post('/api/alerts/trigger', (req, res) => {
  const { sensorId, floor, room } = req.body
  
  const alert = {
    id: Date.now(),
    sensorId,
    floor,
    room,
    timestamp: new Date().toISOString(),
    status: 'active'
  }
  
  alerts.push(alert)
  
  res.json({
    success: true,
    alert
  })
})

app.post('/api/alerts/clear/:id', (req, res) => {
  const alertId = parseInt(req.params.id)
  const index = alerts.findIndex(a => a.id === alertId)
  
  if (index !== -1) {
    alerts.splice(index, 1)
    res.json({ success: true })
  } else {
    res.status(404).json({ success: false, error: 'Alert not found' })
  }
})

app.get('/api/alerts', (req, res) => {
  res.json({ alerts })
})

app.listen(PORT, () => {
  console.log(`Alert API server running on http://localhost:${PORT}`)
})
