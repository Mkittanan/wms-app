const pool = require('../db')

exports.getBalance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id, m.name, m.unit, m.price, m.min_stock,
        COALESCE(SUM(si.qty), 0) AS total_in,
        COALESCE(SUM(so.qty), 0) AS total_out,
        COALESCE(SUM(si.qty), 0) - COALESCE(SUM(so.qty), 0) AS balance
      FROM materials m
      LEFT JOIN stock_in  si ON si.material_id = m.id
      LEFT JOIN stock_out so ON so.material_id = m.id
      GROUP BY m.id
      ORDER BY m.id
    `)
    res.json(result.rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getMonthly = async (req, res) => {
  try {
    const inResult = await pool.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        SUM(qty * price) AS total
      FROM stock_in
      GROUP BY month ORDER BY month
    `)
    const outResult = await pool.query(`
      SELECT
        TO_CHAR(s.date, 'YYYY-MM') AS month,
        SUM(s.qty * m.price) AS total
      FROM stock_out s
      LEFT JOIN materials m ON s.material_id = m.id
      GROUP BY month ORDER BY month
    `)
    res.json({ stockIn: inResult.rows, stockOut: outResult.rows })
  } catch (err) { res.status(500).json({ message: err.message }) }
}