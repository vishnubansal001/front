import {FaSearch} from 'react-icons/fa'
import {RxCross1} from "react-icons/rx"
import {Link, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';

export default function Header() {
    const {currentUser} = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);
    const [showSearch, setShowSearch] = useState(false);
    if(window.location.pathname === "/search") return null;
    else return (
        <header
            className='blur_it shadow-2xl text-white z-[10000] fixed w-full lg:w-[70%] px-10 left-1/2 -translate-x-1/2 border-[0.5px] border-white rounded-xl top-[1rem]'>
            <div className='flex justify-between items-center max-w-6xl  mx-auto p-2'>
                <Link to='/'>
                    <h1 className='font-bold text-[2rem] flex flex-wrap'>
                        Aanjulli Real Estate
                    </h1>
                </Link>
                <ul className='flex gap-4 text-white items-center'>
                    <Link to='/'>
                        <li className='hidden sm:inline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline '>About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img
                                className='rounded-full h-7 w-7 object-cover'
                                src={currentUser.avatar}
                                alt='profile'
                            />
                        ) : (
                                <li className=''> Sign in</li>
                            )}
                        </Link>
                        <button
                            className={`relative items-center gap-2 hidden sm:flex`}  // hide on mobile
                            onClick={() => setShowSearch(!showSearch)}
                        >
                            Search
                            <FaSearch size={11} />
                            <div className={`w-full bg-white absolute h-[0.5px] bottom-[-2px]`} />
                        </button>
                    }
                    {
                        showSearch && <div>
                            <form
                                onSubmit={handleSubmit}
                                className='border-[0.5px] gap-[0.5rem] p-2 rounded-lg flex items-center'
                            >
                                <input type="text"
                                       placeholder="Search..."
                                       className='bg-transparent focus:outline-none w-24 sm:w-64'
                                       value={searchTerm}
                                       onChange={(e) => setSearchTerm(e.target.value)}/>
                                <button>
                                    <FaSearch className='text-slate-600 hidden sm-inline'/>
                                </button>
                            </form>
                        </div>
                    }
                    {
                        showSearch && <div className={`cursor-pointer`} onClick={() => setShowSearch(!showSearch)}>
                        <RxCross1 />
                        </div>
                    }
                </ul>

            </div>
        </header>
    )
}
