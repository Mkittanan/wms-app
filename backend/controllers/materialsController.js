const pool = require('../db')

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materials ORDER BY id')
    res.json(result.rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  const { name, unit, price, min_stock } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO materials (name, unit, price, min_stock) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, unit, price, min_stock]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.update = async (req, res) => {
  const { id } = req.params
  const { name, unit, price, min_stock } = req.body
  try {
    const result = await pool.query(
      'UPDATE materials SET name=$1, unit=$2, price=$3, min_stock=$4 WHERE id=$5 RETURNING *',
      [name, unit, price, min_stock, id]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.remove = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM materials WHERE id=$1', [id])
    res.json({ message: 'ลบเรียบร้อยแล้ว' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}