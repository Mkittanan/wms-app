const express = require('express')
const router  = express.Router()
const { getBalance, getMonthly } = require('../controllers/reportsController')
const { protect } = require('../middleware/auth')

router.get('/balance', protect, getBalance)
router.get('/monthly', protect, getMonthly)

module.exports = router