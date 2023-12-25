import React, { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  React.useEffect(() => {
    window.addEventListener("mousemove", e => {
      setMousePosition({y: e.clientY, x: e.clientX});
    })
  }, [])
  return (
    <main  style={{background: `radial-gradient(circle farthest-side at ${mousePosition.x}px ${mousePosition.y}px, #000053 0%, transparent 100%`}} className='p-3 text-white w-screen  mx-auto'>
      <div className={`w-full md:w-[80%] mx-auto mt-[10%]`}>
        <h1 className='text-[3rem] font-semibold text-center my-7'>
          Update a Listing
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col  gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
            <input
                type='text'
                placeholder='Name'
                className='blur_it border-[0.5px] rounded-xl p-4 text-white full mt-10'
                id='name'
                maxLength='62'
                minLength='10'
                required
                onChange={handleChange}
                value={formData.name}
            />
            <textarea
                type='text'
                placeholder='Description'
                className='blur_it border-[0.5px] rounded-xl p-4 text-white full mt-10 '
                id='description'
                required
                onChange={handleChange}
                value={formData.description}
            />
            <input
                type='text'
                placeholder='Address'
                className='blur_it border-[0.5px] rounded-xl p-4 text-white full mt-10 '
                id='address'
                required
                onChange={handleChange}
                value={formData.address}
            />
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='sale'
                    className='w-5'
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                />
                <span>Sell</span>
              </div>
              <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='rent'
                    className='w-5'
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                />
                <span>Rent</span>
              </div>
              <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='parking'
                    className='w-5'
                    onChange={handleChange}
                    checked={formData.parking}
                />
                <span>Parking spot</span>
              </div>
              <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='furnished'
                    className='w-5'
                    onChange={handleChange}
                    checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
              <div className='flex gap-2'>
                <input
                    type='checkbox'
                    id='offer'
                    className='w-5'
                    onChange={handleChange}
                    checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='bedrooms'
                    min='1'
                    max='10'
                    required
                    className='blur_it border-[0.5px] rounded-xl p-2 text-white  '
                    onChange={handleChange}
                    value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='bathrooms'
                    min='1'
                    max='10'
                    required
                    className='blur_it border-[0.5px] rounded-xl p-2 text-white  '
                    onChange={handleChange}
                    value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='10000000'
                    required
                    className='blur_it border-[0.5px] rounded-xl p-2 text-white  '
                    onChange={handleChange}
                    value={formData.regularPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Regular price</p>
                  <span className='text-xs'>($ / month)</span>
                </div>
              </div>
              {formData.offer && (
                  <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        id='discountPrice'
                        min='0'
                        max='10000000'
                        required
                        className='blur_it border-[0.5px] rounded-xl p-2 text-white  '
                        onChange={handleChange}
                        value={formData.discountPrice}
                    />
                    <div className='flex flex-col items-center'>
                      <p>Discounted price</p>
                      <span className='text-xs'>($ / month)</span>
                    </div>
                  </div>
              )}
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>
              Images:
              <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
            </p>
            <div className='flex gap-4'>
              <input
                  onChange={(e) => setFiles(e.target.files)}
                  className='p-3 border border-gray-300 blur_it rounded w-full'
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
              />
              <button
                  type='button'
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className='p-3 hover:bg-white hover:text-green-700 transition-all duration-200 border  rounded uppercase hover:shadow-lg disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className='text-red-700 text-sm'>
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                    <div
                        key={url}
                        className='flex rounded-xl justify-between p-3 border items-center'
                    >
                      <img
                          src={url}
                          alt='listing image'
                          className='w-20 h-20 object-contain rounded-lg'
                      />
                      <button
                          type='button'
                          onClick={() => handleRemoveImage(index)}
                          className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                      >
                        Delete
                      </button>
                    </div>
                ))}
            <button
                disabled={loading || uploading}
                className={'border-white  hover:bg-white hover:text-black hover:font-bold border-[0.5px] p-3'}
            >
              {loading ? 'Updating...' : 'Update listing'}
            </button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}