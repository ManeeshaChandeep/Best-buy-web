import { useState } from 'react';
import ManageItems from "@/components/ManageItems/ManageItems";
import ItemTable from "@/components/ManageItems/ItemTable";

export default function AddItemSection() {
    const [editingProductId, setEditingProductId] = useState<number | undefined>();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEditProduct = (productId: number) => {
        setEditingProductId(productId);
        // Scroll to the form
        document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleProductUpdated = () => {
        setEditingProductId(undefined);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <div id="product-form">
                <ManageItems
                    productId={editingProductId}
                    onProductUpdated={handleProductUpdated}
                />
            </div>
            <ItemTable
                onEditProduct={handleEditProduct}
                refreshKey={refreshKey}
            />
        </>
    );
}
