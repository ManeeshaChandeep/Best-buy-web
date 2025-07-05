
import { useState, useEffect } from 'react';
import { apiClient } from '@/../src/libs/network';


interface Category {
    id: string;
    name: string;
    image: string;
    parent?: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({ name: '', image: '' });
    const [subCategoryFormData, setSubCategoryFormData] = useState({ name: '', image: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = (await apiClient.get('categories/')) as Category[];
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('categories/', categoryFormData);
            setCategoryFormData({ name: '', image: '' });
            fetchCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('categories/', {
                ...subCategoryFormData,
                parent: selectedCategory.id
            });
            setSubCategoryFormData({ name: '', image: '' });
            fetchCategories();
            setSelectedCategory(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubCategoryChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryFormData(prev => ({ ...prev, [name]: value }));
    };

    // Separate main categories and subcategories
    const mainCategories = categories.filter(cat => !cat.parent);
    const subCategories = categories.filter(cat => cat.parent);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {/* Main Category Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Main Category</h2>
                        <form onSubmit={handleAddCategory}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Category Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={categoryFormData.name}
                                    onChange={handleCategoryChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                    Image URL
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="image"
                                    type="text"
                                    name="image"
                                    value={categoryFormData.image}
                                    onChange={handleCategoryChange}
                                    required
                                />
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add Category
                            </button>
                        </form>
                    </div>

                    {/* Sub Category Form */}
                    {selectedCategory && (
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-700">Add Sub Category</h2>
                            <p className="text-sm text-gray-600 mb-4">Parent: {selectedCategory.name}</p>
                            <form onSubmit={handleAddSubCategory}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        Sub Category Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={subCategoryFormData.name}
                                        onChange={handleSubCategoryChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                        Image URL
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="image"
                                        type="text"
                                        name="image"
                                        value={subCategoryFormData.image}
                                        onChange={handleSubCategoryChange}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="submit"
                                    >
                                        Add Sub Category
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div>
                    {/* Category List */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Categories</h2>

                        {loading ? (
                            <p>Loading categories...</p>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2 text-gray-700">Main Categories</h3>
                                    <ul className="space-y-2">
                                        {mainCategories.map(category => (
                                            <li
                                                key={category.id}
                                                className={`p-3 rounded cursor-pointer ${selectedCategory?.id === category.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{category.name}</span>
                                                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            {subCategories.filter(sub => sub.parent === category.id).length} sub
                          </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedCategory && (
                                    <div>
                                        <h3 className="text-lg font-medium mb-2 text-gray-700">Subcategories of {selectedCategory.name}</h3>
                                        <ul className="space-y-2 pl-4">
                                            {subCategories
                                                .filter(sub => sub.parent === selectedCategory.id)
                                                .map(subCategory => (
                                                    <li key={subCategory.id} className="p-2 rounded hover:bg-gray-50">
                                                        {subCategory.name}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
