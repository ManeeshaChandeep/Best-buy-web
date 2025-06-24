import { useState } from 'react';
import axios from 'axios';

export default function ViewProducts() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleAddProduct = async () => {
        const productData = {
            name: "Dell Inspiron",
            sku: "D125",
            model_number: "INS-15",
            price: 150000,
            old_price: 165000,
            quantity: 10,
            warranty: "1 year",
            delivery_available: true,
            description: "High performance laptop",
            category: 1,
            subcategory: 2
        };

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(
                'https://api.bestbuyelectronics.lk/products/',
                productData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization header if required
                        // 'Authorization': 'Bearer your_token_here'
                    }
                }
            );

            setMessage('Product added successfully!');
            console.log('Product added:', response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add product');
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="product-add-container">
            <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="add-product-button"
            >
                {isLoading ? 'Adding...' : 'Add Dell Inspiron'}
            </button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
