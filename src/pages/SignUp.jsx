import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    React.useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            setMousePosition({ y: e.clientY, x: e.clientX });
        });
    }, []);

    return (
        <div
            style={{
                background: `radial-gradient(circle farthest-side at ${window.innerWidth / 2}px ${window.innerHeight / 2}px, #000053 0%, transparent 100%)`,
            }}
            className='h-screen w-screen flex items-center justify-center'>
            <div
                style={{
                    background: `radial-gradient(circle farthest-side at ${mousePosition.x - 110}px ${mousePosition.y - 200}px, #5f002a 0%, black 100%)`,
                }}
                className='w-screen md:w-[85vw] p-10 border-[0.5px] border-white rounded-t-xl relative'>
                <h1 className='text-center font-bold text-white text-[4rem] mb-10'>
                    Sign Up
                    <div className={`bg-white h-[0.5rem] rounded-xl w-full`} />
                </h1>

                <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4'>
                    {/* Your form fields go here */}
                    <OAuth />
                </form>
                <div className='flex gap-2 mt-5 text-white justify-center'>
                    <p>Have an account?</p>
                    <Link to={'/sign-in'}>
                        <span className='text-white'>
                            Sign in
                            <div className={`bg-white w-full rounded-xl h-[1px]`} />
                        </span>
                    </Link>
                </div>
                {error && <p className='text-red-500 mt-5'>{error}</p>}
            </div>
        </div>
    );
}
