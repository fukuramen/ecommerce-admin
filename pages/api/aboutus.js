// pages/api/aboutus.js

import { mongooseConnect } from '@/lib/mongoose';
import { AboutUs } from '@/models/AboutUs';

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await AboutUs.findOne({ _id: req.query.id }));
    } else {
      res.json(await AboutUs.find());
    }
  }

  if (method === 'POST') {
    const { title, description, images, descriptionImages, quillImages } = req.body;

    // Tìm kiếm document dựa trên tiêu đề
    const existingDoc = await AboutUs.findOne({ title });

    if (existingDoc) {
      // Nếu tồn tại document với tiêu đề tương tự, ghi đè dữ liệu
      const updatedDoc = await AboutUs.findOneAndUpdate(
        { _id: existingDoc._id },
        { title, description, images, descriptionImages },
        { new: true, upsert: false }
      );
      res.json(updatedDoc);
    } else {
      // Nếu không tồn tại, tạo document mới
      const newDoc = await AboutUs.create({
        title,
        description,
        images,
        descriptionImages,
        quillImages, // Lưu trữ hình ảnh từ ReactQuill
      });
      res.json(newDoc);
    }
  }

  if (method === 'PUT') {
    const { title, description, images, descriptionImages, quillImages, _id } = req.body;
    const updatedDoc = await AboutUs.findByIdAndUpdate(
      _id,
      { title, description, images, descriptionImages, quillImages }, // Cập nhật hình ảnh từ ReactQuill
      { new: true, upsert: false }
    );
    res.json(updatedDoc);
  }

  // Xử lý xóa hình ảnh từ document
  if (method === 'DELETE') {
    const { aboutusId, imageToDelete } = req.body;

    if (aboutusId && imageToDelete) {
      const aboutus = await AboutUs.findById(aboutusId);
      if (!aboutus) {
        return res.status(404).json({ message: 'Aboutus not found' });
      }
      aboutus.images = aboutus.images.filter((image) => image !== imageToDelete);
      await aboutus.save();
      res.json({ message: 'Image deleted successfully' });
    } else if (req.query?.id) {
      await AboutUs.deleteOne({ _id: req.query?.id });
      res.json({ message: 'AboutUs deleted successfully' });
    } else {
      res.status(400).json({ message: 'Missing aboutus ID or image path' });
    }
  }
}



// import { mongooseConnect } from '@/lib/mongoose';
// import { AboutUs } from '@/models/AboutUs';

// export default async function handler(req, res) {
//   const { method } = req;
//   await mongooseConnect();

//   if (method === 'GET') {
//     if (req.query?.id) {
//       res.json(await AboutUs.findOne({ _id: req.query.id }));
//     } else {
//       res.json(await AboutUs.find());
//     }
//   }

//   // Ghi thêm 1 document mới vào mongodb, giữ nguyên document cũ
//   if (method === 'POST') {
//     const { title, description, images, descriptionImages } = req.body;
//     const aboutUsDoc = await AboutUs.create({
//       title,
//       description,
//       images,
//       descriptionImages,
//     });
//     res.json(aboutUsDoc);
//   }

//   // cập nhật dựa trên document cũ nếu trước đó tồn tại trong database
//   // if (method === 'POST') {
//   //   console.log('POST request body:', req.body); // Thêm log để kiểm tra dữ liệu gửi đến
//   //   const { _id, ...updateData } = req.body;
//   //   if (_id) {
//   //     try {
//   //       const aboutUs = await AboutUs.findOneAndUpdate(
//   //         { _id: _id },
//   //         updateData,
//   //         {
//   //           new: true,
//   //           upsert: false, // Đặt upsert thành false để tránh tạo document mới
//   //         }
//   //       );
//   //       console.log('AboutUs created:', aboutUs); // Log sau khi tạo thành công
//   //       return res.status(200).json(aboutUs);
//   //     } catch (error) {
//   //       console.error('Error updating AboutUs:', error);
//   //       return res.status(500).json({ error: error.message });
//   //     }
//   //   } else {
//   //     // Xử lý tạo mới document nếu không có _id
//   //     try {
//   //       const aboutUs = await AboutUs.create(updateData);
//   //       return res.status(200).json(aboutUs);
//   //     } catch (error) {
//   //       console.error('Error creating AboutUs:', error);
//   //       return res.status(500).json({ error: error.message });
//   //     }
//   //   }
//   // }

//   if (method === 'PUT') {
//     const { title, description, images, descriptionImages, _id } = req.body;
//     await AboutUs.findByIdAndUpdate(_id, {
//       title,
//       description,
//       images,
//       descriptionImages,
//     });
//     res.json(true);
//   }

//   // if (method === 'DELETE') {
//   //   if (req.query?.id) {
//   //     await AboutUs.deleteOne({ _id: req.query?.id });
//   //     res.json(true);
//   //   }
//   // }

//   // Thêm vào điều kiện xóa ảnh từ khâu upload

//   if (method === 'DELETE') {
//     // Kiểm tra xem có phải yêu cầu xóa ảnh từ sản phẩm
//     const { aboutusId, imageToDelete } = req.body;

//     if (aboutusId && imageToDelete) {
//       // Tìm sản phẩm theo _id
//       const aboutus = await AboutUs.findById(aboutusId);
//       if (!aboutus) {
//         return res.status(404).json({ message: 'Aboutus not found' });
//       }
//       // Xóa ảnh khỏi mảng và cập nhật sản phẩm
//       aboutus.images = aboutus.images?.filter(
//         (image) => image !== imageToDelete
//       );
//       await aboutus.save();
//       res.json({ message: 'Image deleted successfully' });
//     } else if (req.query?.id) {
//       // Xóa toàn bộ sản phẩm nếu chỉ có _id trong query
//       await AboutUs.deleteOne({ _id: req.query?.id });
//       res.json({ message: 'AboutUs deleted successfully' });
//     } else {
//       res.status(400).json({ message: 'Missing aboutus ID or image path' });
//     }
//   }
// }




// import { mongooseConnect } from '@/lib/mongoose';
// import { AboutUs } from '@/models/AboutUs';

// export default async function handler(req, res) {
//   const { method } = req;
//   await mongooseConnect();

//   if (method === 'POST') {
//     console.log('POST request body:', req.body); // Thêm log để kiểm tra dữ liệu gửi đến
//     const { _id, ...updateData } = req.body; // Giả sử `_id` được gửi trong body để xác định document cần cập nhật

//     try {
//       const aboutUs = await AboutUs.findOneAndUpdate(
//         { _id: _id }, // Điều kiện tìm kiếm document
//         updateData, // Dữ liệu cần cập nhật
//         { new: true, upsert: true } // Tùy chọn: trả về document sau khi cập nhật và tạo mới nếu không tìm thấy
//       );
//       console.log('AboutUs created:', aboutUs); // Log sau khi tạo thành công
//       return res.status(200).json(aboutUs);
//     } catch (error) {
//       console.error('Error creating AboutUs:', error); // Log lỗi
//       return res.status(500).json({ error: error.message });
//     }
//   }
// }

// Cho trường hợp cập nhật nhiều document bên trong mongodb

// import { mongooseConnect } from '@/lib/mongoose';
// import { AboutUs } from '@/models/AboutUs';

// export default async function handler(req, res) {
//    const { method } = req;
//    await mongooseConnect();

//   if (method === 'POST') {
//     console.log('POST request body:', req.body); // Thêm log để kiểm tra dữ liệu gửi đến
//     try {
//       const aboutUs = await AboutUs.create(req.body);
//       console.log('AboutUs created:', aboutUs); // Log sau khi tạo thành công
//       return res.status(200).json(aboutUs);
//     } catch (error) {
//       console.error('Error creating AboutUs:', error); // Log lỗi
//       return res.status(500).json({ error: error.message });
//     }
//   }
// }
