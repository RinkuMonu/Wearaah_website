import HeroBanner from "../components/Home/HeroBanner";
import TopProducts from "../components/Home/TopProducts";
import PopularProducts from "../components/Home/PopularProducts";
import JoggersSection from "../components/Home/JoggersSection";
import TrendingCategorie from "../components/Home/TrendingCategorie";
import CategoriesSection from "../components/Home/CategoriesSection";
import HoddiesSection from "../components/Home/HoddiesSection";
import CasualTrousers from "../components/Home/CasualTrousers";
import Blazercoat from "../components/Home/Blazercoat";
import DesignerShirts from "../components/Home/Kurtasets";
import CountdownBanner from "../components/Home/BlackFriday";
import BrandsSection from "../components/Home/Brands";
import Discount from "../components/Home/Discount";
import Home_FAQ from "../components/FAQ/Home_FAQ";
export default function Home() {
  return (
    <>
      <HeroBanner />
      <TopProducts />
      <BrandsSection />
      <CategoriesSection />
      <Discount />
      <PopularProducts />
      <JoggersSection />
      <CountdownBanner />
      <TrendingCategorie />
      <HoddiesSection />
      <CasualTrousers />
      <Blazercoat />
      <DesignerShirts />
      <Home_FAQ />
    </>
  )
}
