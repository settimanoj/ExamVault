const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      trim: true,
      uppercase: true,
    },
    slot: {
      type: String,
      required: [
        function() { return this.category !== 'PYQ'; },
        'Slot is required for Recent Papers'
      ],
      trim: true,
      uppercase: true,
    },
    examType: {
      type: String,
      required: [true, 'Exam type is required'],
      enum: ['CAT1', 'CAT2', 'FAT', 'Others'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Slot Paper', 'PYQ'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    publicId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      default: 'pdf',
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for fast filtering
paperSchema.index({ courseCode: 1, slot: 1, examType: 1, category: 1 });
paperSchema.index({ uploader: 1, createdAt: -1 });

module.exports = mongoose.model('Paper', paperSchema);
