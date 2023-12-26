import React from 'react'

export default function About() {
    const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
    React.useEffect(() => {
        window.addEventListener("mousemove", e => {
            setMousePosition({x: e.clientX, y: e.clientY});
        })
        return () => {
            window.removeEventListener("mousemove", function (){});
        }
    }, [])
  return (
    <div style={{background: `radial-gradient(circle farthest-side at ${mousePosition.x}px ${mousePosition.y}px, #000053 0%, transparent 100%)`}} className='py-20 px-4 w-fit h-screen  mx-auto'>
        <div className={`w-[60%] mx-auto mt-[6rem]`}>
            <h1 className='text-[6rem] text-center font-bold mb-4 text-white'>About Aanjulli Real Estate</h1>
            <p className='mb-4 text-gray-200 text-justify'>Aanjulli Real Estate, since 2006 is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.</p>
            <p className='mb-4 text-gray-200 text-justify'>
                Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
            </p>
            <p className='mb-4 text-gray-200 text-justify'>Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.</p>
        </div>
    </div>
  )
}
