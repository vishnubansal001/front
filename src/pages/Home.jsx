import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import React from "react";

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    SwiperCore.use([Navigation]);
    console.log(offerListings);
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4');
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOfferListings();
    }, []);

    const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
    React.useEffect(() => {
        window.addEventListener("mousemove", e => {
            setMousePosition({y: e.clientY, x: e.clientX});
        })
    }, [])

    return (
        <div
            style={{background: `radial-gradient(circle farthest-side at ${mousePosition.x}px ${mousePosition.y}px, #000053 0%, transparent 100%`}}
            className={` w-screen bg-black`}>
            {/* top */}
            <div className='flex flex-col gap-[3rem]  p-28 px-3 max-w-6xl mx-auto'>
                <h1   className={`text-white font-bold md:text-[5.5rem] text-center mt-10`}>
                    Find Your Next Perfect Place With Ease

                </h1>
                <div className='text-gray-400 text-center'>
                    Anjulli Real Estate is the best place to find your next perfect place to
                    live.
                    <br/>
                    We have a wide range of properties for you to choose from.
                </div>
                <Link
                    to={'/search'}
                    className='text-white border-[0.5px] border-white p-3 rounded-xl text-center w-[40%] mx-auto shadow-black shadow-2xl hover:bg-white hover:text-black duration-1000 hover:scale-110 hover:shadow-[blue]'
                >
                    Let's get started...
                </Link>
            </div>

            {/* swiper */}
            <Swiper navigation>
                {offerListings &&
                    offerListings.length > 0 &&
                    offerListings.map((listing) => (
                        <SwiperSlide>
                            <div
                                style={{
                                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                                className='h-[500px]'
                                key={listing._id}
                            ></div>
                        </SwiperSlide>
                    ))}
            </Swiper>

            {/* listing results for offer, sale and rent */}

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                {offerListings && offerListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more
                                offers</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id}/>
                            ))}
                        </div>
                    </div>
                )}
                {rentListings && rentListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl text-white font-semibold'>Recent places for rent</h2>
                            <Link className='text-sm text-gray-500 hover:underline' to={'/search?type=rent'}>Show more
                                places for rent</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id}/>
                            ))}
                        </div>
                    </div>
                )}
                {saleListings && saleListings.length > 0 && (
                    <div className=''>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-white '>Recent places for sale</h2>
                            <Link className='text-sm text-gray-500 hover:underline' to={'/search?type=sale'}>Show more
                                places for sale</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id}/>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}