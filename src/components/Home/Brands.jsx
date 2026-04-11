import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fatchBrands } from "../../features/Brands/brandSlice";

// const brands = [
//     { name: 'Nike', img: './images/Poster/BR1.jpg' },
//     { name: 'Adidas', img: './images/Poster/BR2.jpg' },
//     { name: 'Puma', img: './images/Poster/BR3.jpg' },
//     { name: 'Levi\'s', img: './images/Poster/BR4.jpg' },
//     { name: 'G-Star', img: './images/Poster/BR5.jpg' },
//     { name: 'Supreme', img: './images/Poster/BR6.jpg' },
//     { name: 'Under Armour', img: './images/Poster/BR7.jpg' },
//     { name: 'Reebok', img: './images/Poster/BR8.jpg' },
// ];

const BrandsSection = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brands);
  useEffect(() => {
    dispatch(fatchBrands());
  }, [dispatch]);
  return (
    <section className="py-16 bg-gray-50">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Top Men's Brands
            </h2>
            <span className="text-sm text-gray-500">
              {" "}
              Discover premium brands for your wardrobe. Shop the latest
              collections now.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto">
          {brands?.slice(0, 8)?.map((brand) => (
            <Link
              key={brand.name}
              to={`/productlist?brand=${brand.slug}&brandId=${brand._id}`}
              className="group relative p-4 "
            >
              <img
                // src={brand.img}
                src={`${BASE_URL}${brand?.banner}`}
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
