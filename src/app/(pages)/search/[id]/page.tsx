// components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    image: string;
    title: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    isNew: boolean;
}

const ProductCard = ({
                         id,
                         image,
                         title,
                         originalPrice,
                         salePrice,
                         discount,
                         isNew,
                     }: ProductCardProps) => {
    return (
        <Link href={`/product/${id}`}>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all">
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={300}
                    className="w-full h-60 object-contain mb-4"
                />
                <h2 className="text-lg font-medium mb-1 line-clamp-2">{title}</h2>
                <div className="text-sm text-gray-500 line-through">Rs {originalPrice}</div>
                <div className="text-lg font-bold text-red-600">Rs {salePrice}</div>
                {discount > 0 && (
                    <p className="text-green-600 text-sm">Save {discount}%</p>
                )}
                {isNew && (
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 mt-2 rounded">
            New
          </span>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;

// components/ProductGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
interface Product {
    id: number;
    image: string;
    title: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    isNew: boolean;
}

const ProductGrid = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                let url = `https://api.bestbuyelectronics.lk/products/?page=1&limit=12`;
                if (query.trim() !== "") {
                    url += `&search=${encodeURIComponent(query)}`;
                }
                const res = await fetch(url);
                const data = await res.json();

                const formatted = data.results.map((p: any) => ({
                    id: p.id,
                    image: p.image || p.images?.[0] || "/noimage.jpg",
                    title: p.title || p.name,
                    originalPrice: Number(p.oldPrice || p.originalPrice || 0),
                    salePrice: Number(p.newPrice || p.salePrice || 0),
                    discount: p.discount || 0,
                    isNew: p.isNew || false,
                }));
                setResults(formatted);
            } catch (err) {
                console.error("Error fetching search results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">
                Results for: <span className="text-red-600">{query}</span>
            </h1>
            {loading ? (
                <p>Loading...</p>
            ) : results.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGrid;

// app/search/page.tsx


export default function SearchPage() {
    return <ProductGrid />;
}
