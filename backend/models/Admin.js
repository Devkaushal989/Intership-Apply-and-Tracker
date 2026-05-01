const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      default:  'Super Admin',
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:     String,
      required: true,
    },
    role: {
      type:    String,
      required: true,
      lowercase: true,
      trim:     true,
      default: 'admin',
    },
  },
  { timestamps: true }
)

adminSchema.pre('save', function normalizeAdmin(next) {
  if (this.email) this.email = this.email.toLowerCase().trim()
  if (!this.role) this.role = 'admin'
  else this.role = this.role.toLowerCase().trim()
  next()
})

module.exports = mongoose.model('Admin', adminSchema)