const mongoose = require("mongoose");
const slugify = require("slugify")


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
}, { timestamps: true, versionKey: false });

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;