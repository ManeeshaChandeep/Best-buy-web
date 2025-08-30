"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductListingPage from "@/components/ProductListingPage";

export default function Page() {
    const params = useParams();
    const subcategoryId = params?.subcategoryId as string;

    return (
        <ProductListingPage
            categoryId={subcategoryId}
            showSortInHeader={false}
        />
    );
}
