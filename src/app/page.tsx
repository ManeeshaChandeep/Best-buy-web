'use client';
import Image from "next/image";
import React, {useEffect, useState} from "react";

const BE_URL = "https://api.bestbuyelectronics.lk";

// images
import categoryOne from "@/../public/images/tv.png"
import categoryTwo from "@/../public/images/smartPhone.png"
import categoryThree from "@/../public/images/soundSystems.jpg"
import categoryFour from "@/../public/images/Refrigerators.jpg"
import categoryFive from "@/../public/images/washingMashing.jpg"

import postOne from "@/../public/images/posts/postOne.png"
import postTwo from "@/../public/images/posts/postTwo.png"
import postThree from "@/../public/images/posts/postThree.png"

import itemTvOne from "@/../public/images/tvOne.png"
import itemTvTwo from "@/../public/images/tvTwo.png"
import itemTvThree from "@/../public/images/tvThree.png"
import itemTvFour from "@/../public/images/tvFour.png"
import itemTvFive from "@/../public/images/tvFive.png"
import itemTvSix from "@/../public/images/tvSix.png"

import itemMicrowaveOne from "@/../public/images/microwaveOne.png"
import itemMicrowaveTwo from "@/../public/images/microwaveTwo.png"
import itemMicrowaveThree from "@/../public/images/microwaveThree.png"

import itemWashingMashingOne from "@/../public/images/washingMashingOne.png"

import mobileOne from "@/../public/images/mobileOne.png"
import mobileTwo from "@/../public/images/mobileTwo.png"
import mobileThree from "@/../public/images/mobileThree.png"
import mobileFour from "@/../public/images/mobileFour.png"
import mobileFive from "@/../public/images/mobileFive.png"
import mobileSix from "@/../public/images/mobileSix.png"

import itemFanOne from "@/../public/images/fanOne.png"
import itemFanTwo from "@/../public/images/fanTwo.png"
import blenderFour from "@/../public/images/blenderFour.png"

import acOne from "@/../public/images/acOne.png"

import washingMachineOne from "@/../public/images/washingMashingOne.png"
import washingMachineTwo from "@/../public/images/washingMashingTwo.png"
import washingMachineThree from "@/../public/images/washingMashingThree.png"
import washingMachineFour from "@/../public/images/washingMashingFour.png"
import washingMachineFive from "@/../public/images/washingMashingFive.png"
import washingMachineSix from "@/../public/images/washingMashingSix.png"
import washingMachineSeven from "@/../public/images/washingMashingSeven.png"




import CategoryCard from "@/components/ItemCategory";
import HeroSection from "@/components/HeroSection";
import ItemCard from "@/components/ItemCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {apiClient} from "@/libs/network";

interface Category {
    id: string | number;
    name: string;
    image: string;
    parent?: string | number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    model_number?: string;
    price: number;
    old_price?: number;
    quantity: number;
    warranty?: number;
    delivery_available: boolean;
    category: string;
    subcategory?: string;
    image_url?: string;
    description?: string;
    images?: string[];
}

interface ProductListResponse {
    count: number;
    total_pages: number;
    current_page: number;
    limit: number;
    results: Product[];
}

type CategoryKey = 'category1' | 'category2' | 'category3' | 'category4' | 'category5' | 'category6';

const loadProducts = (params: { category?: number; subcategory?: number }) => {
    const query = new URLSearchParams();

    if (params.category) query.append('category', params.category.toString());
    if (params.subcategory) query.append('subcategory', params.subcategory.toString());

    return apiClient.get<ProductListResponse>(`products/?${query.toString()}`);
};


export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);

    const [productsByCategory, setProductsByCategory] = useState<Record<CategoryKey, Product[]>>({
        category1: [],
        category2: [],
        category3: [],
        category4: [],
        category5: [],
        category6: [],
    });

    const loadProductsByCategory = async (categoryKey: CategoryKey, category: number) => {
        try {
            const res = await loadProducts({ category: category });
            setProductsByCategory(prev => ({
                ...prev,
                [categoryKey]: res.results,
            }));
        } catch (error) {
            console.error(`Failed to load products for ${categoryKey}:`, error);
        }
    };


    useEffect(() => {

        loadProducts({}).then(res => {
            console.log("New Products",res.results);
            setNewProducts(res.results);
        })


        apiClient.get<Category[]>('categories/').then(async res => {

            // Filter categories with no parent (null or undefined or empty)
            const rootCategories = res.filter(
                category => category.parent === null || category.parent === undefined || category.parent === ''
            );

            setCategories(rootCategories);
            console.log(rootCategories);

            // Dynamically load products for each root category
            for (let i = 0; i < rootCategories.length && i < 6; i++) {
                const categoryKey = `category${i + 1}` as CategoryKey;
                const categoryId = Number(rootCategories[i].id);

                console.log("Loading products for category:", categoryKey, "with ID:", categoryId);

                await loadProductsByCategory(categoryKey, categoryId);
            }

        });
    }, []);


    return (
        <div>

            <Header/>
            <HeroSection/>

            <section className='flex justify-center overflow-x-auto no-scrollbar space-x-6 '>
                <CategoryCard imageSrc={categoryOne} title="Tv & Home"/>
                <CategoryCard imageSrc={categoryTwo} title="Smart Phones"/>
                <CategoryCard imageSrc={categoryThree} title="soundSy Systems"/>
                <CategoryCard imageSrc={categoryFour} title="Frigerators"/>
                <CategoryCard imageSrc={categoryFour} title="Frigerators"/>
                <CategoryCard imageSrc={categoryFive} title="Washing Machines"/>
            </section>


            <div className='w-3/4 mx-auto'>
                <div>
                    <div className="border-b border-gray-300 pb-1 mb-2 ">
                        <div className="flex justify-between items-center">
                            <h1 className=" text-gray-800 text-xs md:text-sm font-medium">New Arrived</h1>
                            <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW ALL</a>
                        </div>
                    </div>
                </div>
            </div>


            <section className='flex justify-center  flex-wrap'>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
                    {newProducts.map((product) => (
                        <ItemCard
                            key={product.id}
                            imageUrl={`${BE_URL}${product.images[0]}`}
                            imageSrc={categoryOne}
                            title={product.name}
                            oldPrice={product.old_price}
                            newPrice={product.price}
                            inStock={product.quantity > 0}
                        />
                    ))}
                </div>

                <div className='flex gap-5 my-14 justify-center w-4/5 '>
                    <div>
                        <Image src={postOne} alt={""} className='rounded-md '/>
                    </div>
                    <div>
                        <Image src={postTwo} alt={""} className='rounded-md'/>
                    </div>
                </div>

                {categories.slice(0, 6).map((category, index) => {
                    const categoryKey = `category${index + 1}` as CategoryKey;
                    const products = productsByCategory[categoryKey] || [];

                    return (
                        <div key={category.id} className="w-3/4 mx-auto mt-10">
                            {/* Category Header */}
                            <div className="border-b border-gray-300 pb-1 mb-2">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-gray-800 text-xs md:text-sm font-medium">{category.name}</h1>
                                    <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW ALL</a>
                                </div>
                            </div>

                            {/* Product Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                {products.map(product => (
                                    <ItemCard
                                        key={product.id}
                                        imageUrl={`${BE_URL}${product.images[0]}`}
                                        imageSrc={categoryOne}
                                        title={product.name}
                                        oldPrice={product.old_price}
                                        newPrice={product.price}
                                        inStock={product.quantity > 0}
                                    />
                                ))}

                                {/* Optional: Show fallback if no products */}
                                {products.length === 0 && (
                                    <p className="text-xs text-gray-500 col-span-full">No products available.</p>
                                )}
                            </div>
                        </div>
                    );
                })}


                <div>
                    <Image src={postThree} alt={""} className='rounded-md'/>
                </div>

            </section>
            <Footer/>
        </div>
    );
}
