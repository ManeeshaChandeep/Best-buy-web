import { useState } from 'react';
import ManageItems from "@/components/ManageItems/ManageItems";
import ItemTable from "@/components/ManageItems/ItemTable";

export default function AddItemSection() {
    const [editingProductId, setEditingProductId] = useState<number | undefined>();
    const [refreshKey, setRefreshKey] = useState(0);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleEditProduct = (productId: number) => {
        setEditingProductId(productId);
        setShowAddForm(true);
        // Scroll to the form
        document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleProductUpdated = () => {
        setEditingProductId(undefined);
        setShowAddForm(false);
        setRefreshKey(prev => prev + 1);
    };

    const resetForms = () => {
        setEditingProductId(undefined);
        setShowAddForm(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            resetForms();
                            setShowAddForm(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        + Add Product
                    </button>
                    <button
                        onClick={resetForms}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Add/Edit Product Form */}
                {(showAddForm || editingProductId) && (
                    <div id="product-form" className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                {editingProductId ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button
                                onClick={resetForms}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <ManageItems
                            productId={editingProductId}
                            onProductUpdated={handleProductUpdated}
                        />
                    </div>
                )}

                {/* Product Table */}
                <div className="bg-white rounded-lg shadow-md">
                    <ItemTable
                        onEditProduct={handleEditProduct}
                        refreshKey={refreshKey}
                    />
                </div>
            </div>
        </div>
    );
}
