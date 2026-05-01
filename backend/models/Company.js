const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const companySchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Company name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,          // 1 company = 1 login
      trim:      true,
      lowercase: true,
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
    },
    industry: {
      type:    String,
      default: '',
    },
    website: {
      type:    String,
      default: '',
    },
    logo: {
      type:    String,
      default: '',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Company', companySchema)
