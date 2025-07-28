"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import categoryOne from "../../../../public/images/tv.png";
import ItemCard from "@/components/ItemCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const BE_URL = "https://api.bestbuyelectronics.lk";

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

const ProductGrid = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 12;

    const fetchResults = async (currentPage: number) => {
        try {
            setLoading(true);
            let url = `${BE_URL}/products/?page=${currentPage}&limit=${limit}`;
            if (query.trim() !== "") {
                url += `&search=${encodeURIComponent(query)}`;
            }
            const res = await fetch(url);
            const data = await res.json();

            setResults(data.results || []);
            setTotalPages(Math.ceil(data.count / limit)); // Ensure count is returned from API
        } catch (err) {
            console.error("Error fetching search results:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1); // Reset to page 1 when query changes
    }, [query]);

    useEffect(() => {
        fetchResults(page);
    }, [query, page]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

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
                <>
                    <div className="flex flex-wrap gap-4">
                        {results.map((product) => (
                            <ItemCard
                                id={product.id}
                                key={product.id}
                                imageUrl={`${BE_URL}${product.images?.[0] || ""}`}
                                imageSrc={categoryOne}
                                title={product.name}
                                oldPrice={product.old_price}
                                newPrice={product.price}
                                inStock={product.quantity > 0}
                            />
                        ))}
                    </div>

                    {/* Pagination with red styling and numbers only */}
                    <div className="flex justify-center mt-8">
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        borderColor: "red",
                                        color: "red",
                                    },
                                    "& .Mui-selected": {
                                        backgroundColor: "red !important",
                                        color: "white !important",
                                        borderColor: "red !important",
                                    },
                                }}
                            />
                        </Stack>
                    </div>
                </>
            )}
        </div>
    );
};

export default function SearchPage() {
    return <ProductGrid />;
}
