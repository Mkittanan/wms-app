const express = require('express')
const router  = express.Router()
const pool    = require('../db')
const { protect } = require('../middleware/auth')

router.get('/', protect, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, f.name AS product, f.unit
      FROM production_orders p
      LEFT JOIN finish_goods f ON p.finish_good_id = f.id
      ORDER BY p.id DESC
    `)
    res.json(result.rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body
  try {
    const result = await pool.query(
      'UPDATE production_orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router