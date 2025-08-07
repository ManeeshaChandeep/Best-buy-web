"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BE_URL = "https://api.bestbuyelectronics.lk";

// images
import categoryOne from "@/../public/images/tv.png";
import postOne from "@/../public/images/posts/postOne.png";
import postTwo from "@/../public/images/posts/postTwo.png";
import postThree from "@/../public/images/posts/postThree.png";

import HeroSection from "@/components/HeroSection";
import ItemCard from "@/components/ItemCard";
import { apiClient } from "@/libs/network";

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

type CategoryKey =
    | "category1"
    | "category2"
    | "category3"
    | "category4"
    | "category5"
    | "category6";

const loadProducts = (params: { category?: number; subcategory?: number }) => {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category.toString());
    if (params.subcategory)
        query.append("subcategory", params.subcategory.toString());

    return apiClient.get<ProductListResponse>(`products/?${query.toString()}`);
};

// ✅ EXTRACTED OUTSIDE
const ResponsiveImageGallery = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const sliderSettings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        arrows: true,
    };

    const images = [postOne, postTwo];

    return (
        <div className="w-full my-14">
            {isMobile ? (
                <Slider {...sliderSettings}>
                    {images.map((img, idx) => (
                        <div key={idx} className="px-4">
                            <Image src={img} alt={`Post ${idx}`} className="rounded-md" />
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="flex gap-5 justify-center">
                    {images.map((img, idx) => (
                        <div key={idx}>
                            <Image src={img} alt={`Post ${idx}`} className="rounded-md" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
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
            const res = await loadProducts({ category });
            setProductsByCategory((prev) => ({
                ...prev,
                [categoryKey]: res.results,
            }));
        } catch (error) {
            console.error(`Failed to load products for ${categoryKey}:`, error);
        }
    };

    useEffect(() => {
        loadProducts({}).then((res) => {
            setNewProducts(res.results);
        });

        apiClient.get<Category[]>("categories/").then(async (res) => {
            const rootCategories = res.filter(
                (category) =>
                    category.parent === null ||
                    category.parent === undefined ||
                    category.parent === ""
            );

            setCategories(rootCategories);

            for (let i = 0; i < rootCategories.length && i < 6; i++) {
                const categoryKey = `category${i + 1}` as CategoryKey;
                const categoryId = Number(rootCategories[i].id);
                await loadProductsByCategory(categoryKey, categoryId);
            }
        });
    }, []);

    const sliderImages = [postOne, postTwo, postThree];
    const sliderSettings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        arrows: true,
    };

    return (
        <div>
            <HeroSection />
            <div className="mt-10 w-full relative px-4 sm:px-6 lg:px-8">
                <Slider {...sliderSettings}>
                    {sliderImages.map((img, index) => (
                        <div key={index} className="w-full h-[180px] sm:h-[250px] md:h-[300px]">
                            <Image
                                src={img}
                                alt={`Slide ${index + 1}`}
                                className="rounded-md w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="mx-4 sm:mx-6 md:mx-12">
                <div className="border-b border-gray-300 pb-1 mb-2 mt-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-gray-800 text-xs md:text-sm font-medium">
                            New Arrived
                        </h1>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 text-xs md:text-sm"
                        >
                            VIEW ALL
                        </a>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-6 no-scrollbar">
                    {newProducts.map((product) => (
                        <div key={product.id} className="flex-shrink-0">
                            <ItemCard
                                id={product.id}
                                imageUrl={
                                    product.images?.[0]
                                        ? `${BE_URL}${
                                            product.images[0].startsWith("/")
                                                ? product.images[0]
                                                : "/" + product.images[0]
                                        }`
                                        : "/fallback.jpg"
                                }
                                imageSrc={categoryOne}
                                title={product.name}
                                oldPrice={product.old_price}
                                newPrice={product.price}
                                inStock={product.quantity > 0}
                            />
                        </div>
                    ))}
                    {newProducts.length === 0 && (
                        <p className="text-xs text-gray-500 w-full">No products available.</p>
                    )}
                </div>

                <section className="flex justify-center flex-wrap">
                    {/* ✅ Replaced with the ResponsiveImageGallery */}
                    <ResponsiveImageGallery />

                    {categories.slice(0, 6).map((category, index) => {
                        const categoryKey = `category${index + 1}` as CategoryKey;
                        const products = productsByCategory[categoryKey] || [];

                        return (
                            <div key={category.id} className="mt-10 w-full">
                                <div className="border-b border-gray-300 pb-1 mb-2">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-gray-800 text-xs md:text-sm font-medium">
                                            {category.name}
                                        </h1>
                                        <a
                                            href="#"
                                            className="text-blue-600 hover:text-blue-800 text-xs md:text-sm"
                                        >
                                            VIEW ALL
                                        </a>
                                    </div>
                                </div>

                                <div className="flex overflow-x-auto gap-4 no-scrollbar">
                                    {products.map((product) => (
                                        <div key={product.id} className="flex-shrink-0">
                                            <ItemCard
                                                id={product.id}
                                                imageUrl={
                                                    product.images?.[0]
                                                        ? `${BE_URL}${
                                                            product.images[0].startsWith("/")
                                                                ? product.images[0]
                                                                : "/" + product.images[0]
                                                        }`
                                                        : "/fallback.jpg"
                                                }
                                                imageSrc={categoryOne}
                                                title={product.name}
                                                oldPrice={product.old_price}
                                                newPrice={product.price}
                                                inStock={product.quantity > 0}
                                            />
                                        </div>
                                    ))}
                                    {products.length === 0 && (
                                        <p className="text-xs text-gray-500 w-full">
                                            No products available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </div>

            <div className="mt-10 w-full">
                <Image src={postThree} alt="" className="rounded-md" />
            </div>
        </div>
    );
}
