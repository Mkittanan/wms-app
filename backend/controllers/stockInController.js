const pool = require('../db')

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, m.name AS material_name, m.unit, l.name AS location_name
      FROM stock_in s
      LEFT JOIN materials m ON s.material_id = m.id
      LEFT JOIN locations l ON s.location_id = l.id
      ORDER BY s.date DESC, s.id DESC
    `)
    res.json(result.rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  const { material_id, qty, price, lot, location_id, date, recorded_by } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO stock_in (material_id, qty, price, lot, location_id, date, recorded_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [material_id, qty, price, lot, location_id, date, recorded_by]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}