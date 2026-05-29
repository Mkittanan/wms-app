const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'ไม่มี Token กรุณา Login ก่อน' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}

exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' })
  }
  next()
}