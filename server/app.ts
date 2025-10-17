// server/app.ts
import { Hono } from 'hono'
import { authRoute } from './auth/kinde'
import { logger } from 'hono/logger'
import { expensesRoute } from './routes/expenses'

import { cors } from 'hono/cors'



export const app = new Hono()

app.route('/api/auth', authRoute)


// Global logger (from Lab 1)
app.use('*', logger())
app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))


// Custom timing middleware
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  // Add a response header so we can see timings in curl or other clients
  c.header('X-Response-Time', `${ms}ms`)
})

// Health & root
app.get('/', (c) => c.json({ message: 'OK' }))
app.get('/health', (c) => c.json({ status: 'healthy' }))

// Mount API routes
app.route('/api/expenses', expensesRoute)

import { secureRoute } from './routes/secure'
app.route('/api/secure', secureRoute)

import { uploadRoute } from './routes/upload'
app.route('/api/upload', uploadRoute)

export default app
