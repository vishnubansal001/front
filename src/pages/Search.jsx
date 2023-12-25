import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import {useSelector} from "react-redux";
import {FaSearch} from "react-icons/fa";
import {RxCross1} from "react-icons/rx";

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSidebardata({...sidebardata, type: e.target.id});
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({...sidebardata, searchTerm: e.target.value});
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({...sidebardata, sort, order});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };
    return (
        <div className='flex flex-col md:flex-row'>
            <div style={{background: `radial-gradient(circle farthest-side at 0px 0px, #5b0028 0%, transparent 70%)`}} className='p-7 border-white border-r-[0.5px] shadow-2xl shadow-[#292929] md:min-h-screen text-white'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full text-white bg-transparent outline-none '
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className=' items-center '>
                        <h1 className={`font-bold my-3`}>Type:</h1>
                        <div className={`flex flex-col gap-[1rem]`}>
                            <div className='flex gap-2'>
                                <input
                                    type='checkbox'
                                    id='all'
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'all'}
                                />
                                <span>Rent & Sale</span>
                            </div>
                            <div className='flex gap-2'>
                                <input
                                    type='checkbox'
                                    id='rent'
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'rent'}
                                />
                                <span>Rent</span>
                            </div>
                            <div className='flex gap-2'>
                                <input
                                    type='checkbox'
                                    id='sale'
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'sale'}
                                />
                                <span>Sale</span>
                            </div>
                            <div className='flex gap-2'>
                                <input
                                    type='checkbox'
                                    id='offer'
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={sidebardata.offer}
                                />
                                <span>Offer</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='parking'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='furnished'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-6'>
                        <label className='font-semibold'>Sort:</label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id='sort_order'
                            className='border rounded-lg p-2 flex-1 bg-transparent '
                        >
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='font-bold hover:text-white hover:bg-transparent border-white border-[1px] bg-white text-black p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>
            <div style={{background: `radial-gradient(circle farthest-side at ${window.innerWidth - 200}px ${window.innerHeight}px, #000052 0%, transparent 70%)`}} className='flex-1  relative'>
                <h1 className={`text-white m-4 mx-10  font-bold text-[3rem]`}>Search Results: </h1>
                <div className='p-2 w-full  justify-around px-10 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-500 text-center w-full'>
                            Loading...
                        </p>
                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing}/>
                        ))}
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-7 text-center w-full'
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


function Header() {
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
    return (
        <header
            className='blur_it shadow-2xl text-white fixed w-full lg:w-[70%] px-10 left-1/2 -translate-x-1/2 border-[0.5px] border-white rounded-xl top-[1rem]'>
            <div className='flex justify-between items-center max-w-6xl  mx-auto p-2'>
                <Link to='/'>
                    <h1 className='font-bold text-[2rem] flex flex-wrap'>
                        Anjulli Real Estate
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
                    {
                        !showSearch && <button className={`flex relative items-center gap-2`}
                                               onClick={() => setShowSearch(!showSearch)}>
                            Search
                            <FaSearch size={11}/>
                            <div className={`w-full bg-white absolute h-[0.5px] bottom-[-2px]`}/>
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
                                    <FaSearch className='text-slate-600'/>
                                </button>
                            </form>
                        </div>
                    }
                    {
                        showSearch && <div className={`cursor-pointer`} onClick={() => setShowSearch(!showSearch)}>
                            <RxCross1/>
                        </div>
                    }
                </ul>
            </div>
        </header>
    )
}

