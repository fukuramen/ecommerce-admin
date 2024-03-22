//components/AboutUsForm.js

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles của Quill
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';
import { ReactSortable } from 'react-sortablejs';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

export default function AboutUs({
  _id,
  title: existingTitle,
  description: existingDescription,
  images: existingImages,
  descriptionImages: existingDescriptionImages,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [images, setImages] = useState(existingImages || []);
  const [goToAboutUs, setgoToAboutUs] = useState(false);
  const [descriptionImages, setDescriptionImages] = useState(
    existingDescriptionImages || []
  );
  // const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); //sử dụng cho spinner khi save
  // const [aboutUs, setAboutUs] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }], // Thêm mục này để canh lề
      ['link', 'image'],
      [{ color: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'color',
    'align', // Thêm mục này để định dạng canh lề
  ];
  
  async function uploadImageForQuill(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/upload', formData);
    const imageUrl = res.data.link;
    return imageUrl;
  }

  //hàm lấy danh sách URL hình ảnh từ HTML của ReactQuill
  function getQuillImagesFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = Array.from(doc.getElementsByTagName('img')).map(img => img.src);
    return images;
  }

  async function handleSave(ev) {
    ev.preventDefault();
    setIsSaving(true); // Đặt trạng thái đang lưu
  
    const data = {
      title,
      description,
      images,
      descriptionImages,
      quillImages: getQuillImagesFromHTML(description),
      _id,
    };
  
    try {
      if (_id) {
        // update aboutus
        await axios.put('/api/aboutus', data);
      } else {
        // create aboutus
        await axios.post('/api/aboutus', data);
      }
      setgoToAboutUs(true);
    } catch (error) {
      console.error('Error saving AboutUs:', error);
      // Xử lý lỗi nếu cần
    } finally {
      setIsSaving(false); // Đặt lại trạng thái đang lưu sau khi hoàn tất
    }
  }

  if (goToAboutUs) {
    router.push('/aboutus');
  }

  async function uploadImages(ev) {
    // console.log(ev);
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    // console.log(images);
    setImages(images);
  }

  function removeImage(aboutusId, imageToDelete) {
    // Cập nhật trạng thái images để loại bỏ hình ảnh khỏi giao diện người dùng
    const updatedImages = images.filter((image) => image !== imageToDelete);
    setImages(updatedImages);

    // Gửi yêu cầu tới máy chủ để xóa hình ảnh khỏi cơ sở dữ liệu
    axios
      .delete('/api/aboutus', {
        data: { aboutusId: aboutusId, imageToDelete: imageToDelete },
      })
      .then((response) => {
        // Xử lý phản hồi thành công từ máy chủ ở đây
        console.log(response.data.message);
      })
      .catch((error) => {
        // Xử lý lỗi ở đây
        console.error(
          'There was an error deleting the image:',
          error.response.data.message
        );
      });
  }

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <form onSubmit={handleSave}>
      <label>Tiêu đề</label>
      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <label>Hình ảnh</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link, index) => (
              <div
                key={link}
                className="relative h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
                <button
                  className="absolute top-0 right-0 bg-red-400 text-white p-0.5 rounded"
                  onClick={() => removeImage(_id, link)}
                >
                  Xóa
                </button>
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Thêm ảnh</div>
          <input
            type="file"
            onChange={uploadImages}
            className="hidden"
          />
        </label>
      </div>
      <label>Nội dung chi tiết</label>
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        modules={modules}
        formats={formats}
        onUploadImage={uploadImageForQuill}
      />
     {isSaving ? (
      <Spinner fullWidth />
    ) : (
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 mr-2"
      >
        Lưu
      </button>
    )}
      <button
        type="button"
        onClick={handleCancel}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Hủy
      </button>
    </form>
  );
}
