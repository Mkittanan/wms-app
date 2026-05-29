const pool = require('../db')

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY id')
    res.json(result.rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.create = async (req, res) => {
  const { name, max_pallets, size } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO locations (name, max_pallets, size) VALUES ($1,$2,$3) RETURNING *',
      [name, max_pallets, size]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.update = async (req, res) => {
  const { id } = req.params
  const { name, max_pallets, used_pallets, size } = req.body
  try {
    const result = await pool.query(
      'UPDATE locations SET name=$1, max_pallets=$2, used_pallets=$3, size=$4 WHERE id=$5 RETURNING *',
      [name, max_pallets, used_pallets, size, id]
    )
    res.json(result.rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.remove = async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM locations WHERE id=$1', [id])
    res.json({ message: 'ลบเรียบร้อยแล้ว' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}