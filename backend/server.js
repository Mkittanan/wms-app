const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Routes (จะเพิ่มทีละตัว)
app.use('/api/auth',       require('./routes/auth'))
app.use('/api/materials',  require('./routes/materials'))
app.use('/api/locations',  require('./routes/locations'))
app.use('/api/stock-in',   require('./routes/stockIn'))
app.use('/api/stock-out',  require('./routes/stockOut'))
app.use('/api/finish-goods', require('./routes/finishGoods'))
app.use('/api/production', require('./routes/production'))
app.use('/api/reports',    require('./routes/reports'))

app.get('/', (req, res) => res.json({ message: 'WMS API Running ✅' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))