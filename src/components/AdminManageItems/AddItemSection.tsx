import { useState } from 'react';
import ItemTable from "@/components/AdminManageItems/ItemTable";

export default function  AddItemSection() {
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
            <div>

            </div>
            <ItemTable
                onEditProduct={handleEditProduct}
                refreshKey={refreshKey}
            />
        </>
    );
}
