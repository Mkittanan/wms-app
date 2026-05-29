const express = require('express')
const router  = express.Router()
const { getAll, create } = require('../controllers/stockOutController')
const { protect } = require('../middleware/auth')

router.get('/',  protect, getAll)
router.post('/', protect, create)

module.exports = router