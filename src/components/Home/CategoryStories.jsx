import React from "react";
import { Link } from "react-router-dom";

const STORY_CATEGORIES = [
  {
    name: "JEANS",
    tag: "DENIM",
    image: "/images/23.jpg",
    link: "/productlist?subCategoryId=69c23c0df1295fef10514873&subCategory=jeans",
    isHot: true,
  },
  {
    name: "SHIRTS",
    tag: "CASUAL",
    image: "/images/1.jpg",
    link: "/productlist?category=shirts",
  },
  {
    name: "FORMAL WEAR",
    tag: "OFFICE",
    image: "/images/2.jpg",
    link: "/productlist?category=formal-wear&ctd=69c50b8293df3e7bd375833a",
  },
  {
    name: "BLAZERS",
    tag: "SUITS",
    image: "/images/15.jpg",
    link: "/productlist?category=blazers",
  },
  {
    name: "NEW IN",
    tag: "FRESH",
    image: "/images/10.webp",
    link: "/productlist?isNewArrival=true",
    isNew: true,
  },
  {
    name: "50% OFF",
    tag: "DEALS",
    image: "/images/12.webp",
    link: "/productlist",
    isSale: true,
  },
  {
    name: "BRANDS",
    tag: "LABELS",
    image: "/images/14.webp",
    link: "/productlist",
  },
];

export default function CategoryStories() {
  return (
    <section className="bg-white border-b border-neutral-200 py-4 sm:py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {STORY_CATEGORIES.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="flex flex-col items-center group shrink-0"
            >
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-neutral-300 via-neutral-200 to-neutral-400 group-hover:from-[#ED1C24] group-hover:to-[#000000] transition-all duration-300 shadow-sm group-hover:shadow-md">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-100 p-0.5 bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/1.jpg";
                    }}
                  />
                </div>
                {item.isHot && (
                  <span className="absolute -top-1 -right-1 bg-[#ED1C24] text-white text-[9px] font-normal uppercase px-1.5 py-0.2 rounded-full tracking-wider shadow-xs">
                    HOT
                  </span>
                )}
                {item.isSale && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-normal uppercase px-1.5 py-0.2 rounded-full tracking-wider shadow-xs">
                    SALE
                  </span>
                )}
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-normal uppercase tracking-wider text-neutral-800 group-hover:text-black transition-colors text-center">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
