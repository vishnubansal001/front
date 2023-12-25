import {useSelector} from 'react-redux';
import React, {useRef, useState, useEffect} from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import {app} from '../firebase';
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
} from '../redux/user/userSlice';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';

export default function Profile() {
    const fileRef = useRef(null);
    const {currentUser, loading, error} = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({...formData, avatar: downloadURL})
                );
            }
        );
    };
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };
    const handleSignOut = async () => {

        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(data.message));
        }
    };
    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }

            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    };
    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
        } catch (error) {
            console.log(error.message);
        }
    };


    const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
    React.useEffect(() => {
        window.addEventListener("mousemove", e => {
            setMousePosition({y: e.clientY, x: e.clientX});
        })
    }, [])


    const some_style = {
        backgroundColor: "rgba(0,0,0,0.26)",
        backdropFilter: "blur(20px)",
    }
    return (
        <div
            style={{background: `radial-gradient(circle farthest-side at ${mousePosition.x}px ${mousePosition.y}px, #000053 0%, transparent 100%`}}
            className={`w-screen bg-black absolute top-0 flex justify-center items-center pt-[4%] trans_black`}>
            <div style={some_style} className={`w-[70%] px-10 mx-auto border-[0.5px] border-white rounded-xl mt-[4rem] mb-10 pb-10`}>
                <h1 className='text-3xl underline underline-offset-8 font-semibold  text-white p-4 mt-7'>Profile</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        onChange={(e) => setFile(e.target.files[0])}
                        type='file'
                        ref={fileRef}
                        hidden
                        accept='image/*'
                    />
                    <img
                        onClick={() => fileRef.current.click()}
                        src={formData.avatar || currentUser.avatar}
                        alt='profile'
                        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                    />
                    <p className='text-sm self-center'>
                        {fileUploadError ? (
                            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
                        ) : filePerc > 0 && filePerc < 100 ? (
                            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                        ) : filePerc === 100 ? (
                            <span className='text-green-700'>Image successfully uploaded!</span>
                        ) : (
                            ''
                        )}
                    </p>
                    <input
                        type='text'
                        placeholder='username'
                        defaultValue={currentUser.username}
                        id='username'
                        className='border-[0.5px] border-white p-3 rounded-xl outline-none bg-transparent text-white'
                        onChange={handleChange}
                    />
                    <input
                        type='email'
                        placeholder='email'
                        id='email'
                        defaultValue={currentUser.email}
                        className='border-[0.5px] border-white p-3 rounded-xl outline-none bg-transparent text-white'
                        onChange={handleChange}
                    />
                    <input
                        type='password'
                        placeholder='password'
                        onChange={handleChange}
                        id='password'
                        className='border-[0.5px] border-white p-3 rounded-xl outline-none bg-transparent text-white'
                    />
                    <button
                        disabled={loading}
                        className='bg-transparent border-[0.5px] border-white text-white hover:text-black font-semibold hover:bg-white transition-colors duration-200 rounded-lg p-3  disabled:opacity-80'
                    >
                        {loading ? 'Loading...' : 'Update'}
                    </button>
                    <Link
                        className='bg-white border-[0.5px] border-white text-black hover:bg-transparent hover:text-white font-bold transition-colors duration-200 p-3 rounded-lg uppercase text-center hover:opacity-95'
                        to={'/create-listing'}
                    >
                        Create Listing
                    </Link>
                </form>
                <div className='flex justify-between mt-5 px-1 items-center'>
      <span
          onClick={handleDeleteUser}
          className='text-red-500 w-[3rem] hover:underline underline-offset-8 transition-all duration-300 cursor-pointer '
      >
          Delete<span className={`text-transparent`}>_</span>Account
        </span>
                    <button onClick={handleShowListings}
                            className='text-green-500  underline-offset-8 hover:underline  '>
                        Show Listings
                    </button>
                    <span onClick={handleSignOut}
                          className='text-red-500 hover:underline underline-offset-8 cursor-pointer'>Sign<span
                        className={`text-transparent`}>_</span>out</span>
                </div>
                <p className='text-red-700 mt-5'>{error ? error : ''}</p>
                <p style={{backdropFilter: "blur(20px)", display: updateSuccess ? 'block' : 'none'}}
                   className='text-green-700 p-4 bg-white mt-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent border-white font-bold '>
                    {updateSuccess ? 'User is updated successfully!' : ''}
                </p>

                <p className='text-red-700 mt-5'>
                    {showListingsError ? 'Error showing listings' : ''}
                </p>

                {userListings && userListings.length > 0 && (
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-center mt-7 text-2xl text-white underline underline-offset-8  mb-10 font-semibold'>
                            Your Listings
                        </h1>
                        {userListings.map((listing) => (
                            <div
                                key={listing._id}
                                className='border rounded-lg p-3 flex justify-between items-center gap-4'
                            >
                                <Link to={`/listing/${listing._id}`} className={``}>
                                    <img
                                        src={listing.imageUrls[0]}
                                        alt='listing cover'
                                        className='h-16 w-16 object-contain rounded-xl '
                                    />
                                </Link>
                                <Link
                                    className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                                    to={`/listing/${listing._id}`}
                                >
                                    <p className={`text-white`}>{listing.name}</p>
                                </Link>

                                <div className='flex flex-col items-center '>
                                    <button
                                        onClick={() => handleListingDelete(listing._id)}
                                        className='text-red-500 uppercase'
                                    >
                                        Delete
                                    </button>
                                    <br/>
                                    <Link to={`/update-listing/${listing._id}`}>
                                        <button className='text-green-500 uppercase'>Edit</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}