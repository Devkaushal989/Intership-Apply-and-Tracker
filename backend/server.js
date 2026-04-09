const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
const dotenv     = require('dotenv')
const authRoutes = require('./routes/auth')

dotenv.config()

const app = express()

// ── Middleware ──
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ── Routes ──
app.use('/api/auth', authRoutes)

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ message: '🚀 InternBuddy API is running' })
})

// ── Connect to MongoDB FIRST, then start server ──
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // wait 10s before timeout
  })
  .then(() => {
    console.log('MongoDB Atlas Connected Successfully')
    
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error(' MongoDB Connection Failed:', err.message)
    console.error(' Check: 1) Atlas IP Whitelist  2) .env password  3) Internet connection')
    process.exit(1)
  })