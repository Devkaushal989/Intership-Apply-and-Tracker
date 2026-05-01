const mongoose = require('mongoose')

const internshipSchema = new mongoose.Schema(
  {
    company: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Company',
      required: true,
    },
    companyName: {
      type:     String,
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    role: {
      type:     String,
      required: [true, 'Role/Department is required'],
      trim:     true,
    },
    type: {
      type:    String,
      enum:    ['remote', 'onsite', 'hybrid'],
      default: 'remote',
    },
    stipend: {
      type:    String,
      enum:    ['paid', 'unpaid'],
      default: 'paid',
    },
    salary: {
      type:    Number,
      default: 0,
    },
    duration: {
      type:     String,
      required: [true, 'Duration is required'],
    },
    openings: {
      type:    Number,
      default: 1,
    },
    skills: {
      type:    [String],
      default: [],
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    requirements: {
      type:    String,
      default: '',
    },
    status: {
      type:    String,
      enum:    ['active', 'draft', 'paused', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Internship', internshipSchema)