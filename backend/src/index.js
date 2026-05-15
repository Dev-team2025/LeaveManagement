import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectToDatabase } from './db.js'
import { authRouter } from './routes/auth.js'
import { employeeRouter } from './routes/employee.js'
import { managerRouter } from './routes/manager.js'
import { hrRouter } from './routes/hr.js'
import { adminRouter } from './routes/admin.js'

const PORT = Number(process.env.PORT || 8080)
const MONGODB_URI = process.env.MONGODB_URI
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

function buildCorsOptions() {
  const allowed = String(CORS_ORIGIN)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return {
    origin(origin, callback) {
      // allow non-browser requests (curl, server-to-server)
      if (!origin) return callback(null, true)

      // allow explicit list from env
      if (allowed.includes(origin)) return callback(null, true)

      // allow any localhost Vite/React dev port
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true)

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  }
}

const app = express()

app.use(morgan('dev'))
app.use(express.json({ limit: '1mb' }))
app.use(
  cors(buildCorsOptions()),
)

app.get('/api', (_req, res) =>
  res.json({
    ok: true,
    message: 'LMS API is running',
    endpoints: ['/api/health', '/api/auth/login', '/api/auth/profile'],
  }),
)
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/manager', managerRouter)
app.use('/api/hr', hrRouter)
app.use('/api/admin', adminRouter)

app.use((req, res) => res.status(404).json({ message: `Not found: ${req.method} ${req.path}` }))

async function main() {
  await connectToDatabase(MONGODB_URI)
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}/api`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

