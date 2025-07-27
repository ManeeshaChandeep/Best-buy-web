"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Helper function to fetch products with optional search query
const fetchProducts = async (searchQuery = "") => {
    try {
        let url = `https://api.bestbuyelectronics.lk/products/?page=1&limit=12`;
        if (searchQuery.trim() !== "") {
            url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            const data = await fetchProducts(query);
            if (!data) {
                setError("Failed to fetch products.");
                setResults([]);
            } else if (!data.results || data.results.length === 0) {
                setResults([]);
            } else {
                const formatted = data.results.map((p: any) => ({
                    id: p.id,
                    image: p.image || p.images?.[0] || "",
                    title: p.title || p.name,
                    originalPrice: Number(p.oldPrice || p.originalPrice || 0),
                    salePrice: Number(p.newPrice || p.salePrice || 0),
                    discount: p.discount || 0,
                    isNew: p.isNew || false,
                }));
                setResults(formatted);
            }
            setLoading(false);
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
            ) : error ? (
                <p className="text-red-600">{error}</p>
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
}
