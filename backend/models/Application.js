const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Internship',
      required: true,
    },
    internshipTitle: { type: String, required: true },
    companyName:     { type: String, required: true },
    internshipType:  { type: String, default: 'remote' },
    stipend:         { type: String, default: 'unpaid' },
    salary:          { type: Number, default: 0 },

    
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      required: true,
    },
    applicantName:  { type: String, required: true },
    applicantEmail: { type: String, required: true },
    coverLetter:    { type: String, default: '' },
    resumeName:     { type: String, default: '' },

    status: {
      type:    String,
      enum:    ['applied', 'review', 'shortlisted', 'hired', 'rejected'],
      default: 'applied',
    },

    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

applicationSchema.index({ internshipId: 1, candidate: 1 }, { unique: true })

module.exports = mongoose.model('Application', applicationSchema)