const mongoose = require('mongoose');

const POST_STATUSES = ['draft', 'published'];

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot be longer than 150 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [120, 'Slug cannot be longer than 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [250, 'Excerpt cannot be longer than 250 characters'],
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Cover image URL cannot be longer than 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: POST_STATUSES,
        message: 'Status must be either draft or published',
      },
      default: 'draft',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Feed and dashboard queries.
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1, status: 1, createdAt: -1 });

// Approximate reading time in minutes (200 words per minute, minimum 1).
postSchema.virtual('readingTime').get(function readingTime() {
  if (!this.content) return 1;
  const words = this.content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
});

postSchema.statics.STATUSES = POST_STATUSES;

module.exports = mongoose.model('Post', postSchema);
module.exports.POST_STATUSES = POST_STATUSES;
