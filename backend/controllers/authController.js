const pool    = require('../db')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
require('dotenv').config()

exports.login = async (req, res) => {
  const { username, password } = req.body
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    const user   = result.rows[0]

    if (!user) return res.status(401).json({ message: 'ไม่พบ Username นี้' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Password ไม่ถูกต้อง' })

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, username, role FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}