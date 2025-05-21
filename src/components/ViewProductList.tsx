import React from "react";

const ViewProducts: React.FC = () => {
    return (
        <div className="max-w-3xl ml-3 p-6 mt-10">
            <h2 className="text-2xl font-semibold mb-4">View Products</h2>
            {/* Replace with actual product data */}
            <ul className="space-y-2">
                <li className="border p-4 rounded">Product 1</li>
                <li className="border p-4 rounded">Product 2</li>
            </ul>
        </div>
    );
};

export default ViewProducts;
