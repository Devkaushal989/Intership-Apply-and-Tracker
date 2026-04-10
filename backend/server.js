const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
const dotenv     = require('dotenv')
const authRoutes = require('./routes/auth')

dotenv.config()

const app = express()


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ message: ' InternBuddy API is running' })
})

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log(' MongoDB Atlas Connected Successfully')
    app.listen(process.env.PORT || 5000, () => {
      console.log(` Server running on http://localhost:${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.error(' MongoDB Connection Failed:', err.message)
    console.error(' Fix: 1) Check Atlas IP Whitelist  2) Check .env password  3) Check internet')
    process.exit(1)
  })