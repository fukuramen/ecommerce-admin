// models/AboutUs.js

import { model, Schema, models } from 'mongoose';

const AboutUsSchema = new Schema(
  {
    title: { type: String, required: true }, // Tiêu đề là bắt buộc
    images: [{ type: String }], // Mảng các URL hình ảnh
    description: { type: String }, // Mô tả có thể không bắt buộc
    descriptionImages: [{ type: String }], // Mảng các URL hình ảnh mô tả
    quillImages: [{ type: String }], // Thêm trường mới
  },
  {
    timestamps: true, // Thêm timestamps để tự động tạo và cập nhật thời gian
  }
);

export const AboutUs = models.AboutUs || model('AboutUs', AboutUsSchema);