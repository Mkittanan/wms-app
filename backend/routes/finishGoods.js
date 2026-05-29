const express = require('express')
const router  = express.Router()
const pool    = require('../db')
const { protect } = require('../middleware/auth')

router.get('/', protect, async (req, res) => {
  try {
    const goods = await pool.query('SELECT * FROM finish_goods ORDER BY id')
    const bom   = await pool.query(`
      SELECT b.*, m.name AS material_name, m.unit, m.price
      FROM bom b LEFT JOIN materials m ON b.material_id = m.id
    `)
    res.json({ goods: goods.rows, bom: bom.rows })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router