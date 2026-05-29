const pool = require('../db')

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, m.name AS material_name, m.unit, m.price
      FROM stock_out s
      LEFT JOIN materials m ON s.material_id = m.id
      ORDER BY s.date DESC, s.id DESC
    `)
    res.json(result.rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  const { material_id, qty, date, received_by, purpose, recorded_by } = req.body
  try {
    const balanceResult = await pool.query(`
      SELECT
        COALESCE(SUM(si.qty), 0) - COALESCE(SUM(so.qty), 0) AS balance
      FROM materials m
      LEFT JOIN stock_in  si ON si.material_id = m.id
      LEFT JOIN stock_out so ON so.material_id = m.id
      WHERE m.id = $1
      GROUP BY m.id
    `, [material_id])

    const balance = parseFloat(balanceResult.rows[0]?.balance || 0)
    if (qty > balance) {
      return res.status(400).json({ message: `ของไม่พอ — คงเหลือ ${balance} หน่วยเท่านั้น` })
    }

    const result = await pool.query(
      `INSERT INTO stock_out (material_id, qty, date, received_by, purpose, recorded_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [material_id, qty, date, received_by, purpose, recorded_by]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}