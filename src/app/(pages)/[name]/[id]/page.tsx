"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProductListingPage from "@/components/ProductListingPage";

export default function Page() {
    const params = useParams();
    const categoryId = params?.id as string;

    return (
        <ProductListingPage
            categoryId={categoryId}
            showSortInHeader={true}
        />
    );
}
