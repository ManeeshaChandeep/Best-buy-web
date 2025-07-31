import React, { Suspense } from "react";
import ProductGridClient from "./ProductGridClient";

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading search...</div>}>
            <ProductGridClient />
        </Suspense>
    );
}
