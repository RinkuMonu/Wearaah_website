import React from 'react'
import KidsProducts from '../components/Kids/KidsProduct'
import KidsBanner from '../components/Kids/KidsBanner'
import BrandsSection from '../components/Kids/BrandsSection'
import KidsCategories from '../components/Kids/KidsCategories'
import BudgetBuy from '../components/Kids/BudgetBuy'
import TopFeaturedProducts from '../components/Kids/TopFeaturedProducts'

export default function Kids() {
    return (
        <>
            <KidsBanner />
            <KidsProducts />
            <BrandsSection />
            <KidsCategories />
            {/* <BudgetBuy /> */}
            <TopFeaturedProducts />
        </>
    )
}
