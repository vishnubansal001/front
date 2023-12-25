import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('https://back-rho-six.vercel.app/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  React.useEffect(() => {
    window.addEventListener("mousemove", e => {
      setMousePosition({y: e.clientY, x: e.clientX});
    })
  }, [])


  return (
   <div style={{background: `radial-gradient(circle farthest-side at ${window.innerWidth / 2}px ${window.innerHeight /2}px, #000053 0%, transparent 100%`}} className={' h-screen w-screen'}>
     <div  style={{ background: `radial-gradient(circle farthest-side at ${mousePosition.x - 110}px ${mousePosition.y - 200}px, #5f002a 0%, black 100%`}} className=' w-screen md:w-[85vw] p-10 left-1/2 -translate-x-1/2 mx-auto border-[0.5px] border-white rounded-t-xl absolute -bottom-[3rem]  '>
       <h1 className='text-center font-bold text-white text-[4rem] inline-block relative left-1/2 -translate-x-1/2 mb-10'>Sign In
         <div className={`bg-white h-[0.5rem] rounded-xl w-full`}/>
       </h1>
       <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4'>
         <input
             type='email'
             placeholder='email'
             className='blur_it border-[0.5px] rounded-xl p-4 text-white w-[60%] mt-10 mb-5'
             id='email'
             onChange={handleChange}
         />
         <input
             type='password'
             placeholder='password'
             className='blur_it border-[0.5px] rounded-xl p-4 text-white w-[60%]  mb-5'
             id='password'
             onChange={handleChange}
         />
         <button
             disabled={loading}
             className={`bg-white text-black w-[60%] rounded-xl font-bold p-4`}
         >
           {loading ? 'Loading...' : 'Sign In'}
         </button>
         <OAuth />
       </form>
       <div className='flex gap-2 text-white justify-center mt-5'>
         <p>Dont have an account?</p>
         <Link to={'/sign-up'}>
           <span className='text-gray-500 inline-block'>Sign up
            <div className={`bg-white w-full rounded-xl h-[1px]`}/>
           </span>
         </Link>
       </div >
     </div>
   </div>
  );
}