import React from 'react';
import { Link } from 'react-router-dom';

const brandsData = [
    { name: 'Nike', img: './images/Poster/BR1.jpg', to: '/brands/nike' },
    { name: 'Adidas', img: './images/Poster/BR2.jpg', to: '/brands/adidas' },
    { name: 'Puma', img: './images/Poster/BR3.jpg', to: '/brands/puma' },
    { name: 'Levi\'s', img: './images/Poster/BR4.jpg', to: '/brands/levis' },
    { name: 'G-Star', img: './images/Poster/BR5.jpg', to: '/brands/gstar' },
    { name: 'Supreme', img: './images/Poster/BR6.jpg', to: '/brands/supreme' },
    { name: 'Under Armour', img: './images/Poster/BR7.jpg', to: '/brands/underarmour' },
    { name: 'Reebok', img: './images/Poster/BR8.jpg', to: '/brands/reebok' },
];

const BrandsSection = () => {
    
    return (
        <section className="py-16 bg-gray-50">
            <div className=" px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Top Men's Brands</h2>
                        <span className="text-sm text-gray-500"> Discover premium brands for your wardrobe. Shop the latest collections now.</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto">
                    {brandsData.map((brand) => (
                        <Link
                            key={brand.name}
                            to={brand.to}
                            className="group relative p-4 "
                        >
                            <img
                                src={brand.img}
                                alt={brand.name}
                                className=" object-cover h-100 "
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
