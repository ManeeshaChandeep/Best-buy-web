import { useState, useEffect } from 'react';
import { apiClient } from '@/libs/network';

interface Category {
    id: string;
    name: string;
    image: string;
    parent?: string;
}

interface EditingCategory extends Category {
    imageFile?: File;
}

interface UploadResponse {
    filename: string;
    status?: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        image: '',
        imagePreview: ''
    });
    const [subCategoryFormData, setSubCategoryFormData] = useState({
        name: '',
        image: '',
        imagePreview: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();

        return () => {
            // Clean up object URLs
            if (categoryFormData.imagePreview) {
                URL.revokeObjectURL(categoryFormData.imagePreview);
            }
            if (subCategoryFormData.imagePreview) {
                URL.revokeObjectURL(subCategoryFormData.imagePreview);
            }
            if (editingCategory?.imageFile) {
                URL.revokeObjectURL(URL.createObjectURL(editingCategory.imageFile));
            }
        };
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = (await apiClient.get('categories/')) as Category[];
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load categories');
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return null;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('image_name', `category_${Date.now()}`);
            formData.append('type', 'categories');

            const response = await apiClient.post('upload/', formData) as UploadResponse;
            setUploading(false);
            return response.filename;
        } catch (err) {
            setUploading(false);
            setError(err instanceof Error ? err.message : 'Image upload failed');
            return null;
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('categories/', {
                name: categoryFormData.name,
                image: categoryFormData.image
            });
            setCategoryFormData({ name: '', image: '', imagePreview: '' });
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add category');
        }
    };

    const handleAddSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('categories/', {
                name: subCategoryFormData.name,
                image: subCategoryFormData.image,
                parent: selectedCategory?.id
            });
            setSubCategoryFormData({ name: '', image: '', imagePreview: '' });
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add subcategory');
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.put(`categories/?id=${editingCategory?.id}`, {
                id:editingCategory?.id,
                name: editingCategory?.name,
                image: editingCategory?.image
            });
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update category');
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (window.confirm('Are you sure you want to delete this category and all its subcategories?')) {
            try {
                await apiClient.delete(`categories/?id=${categoryId}`, {
                    id:categoryId
                });
                fetchCategories();
                if (selectedCategory?.id === categoryId) {
                    setSelectedCategory(null);
                }
                if (editingCategory?.id === categoryId) {
                    setEditingCategory(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete category');
            }
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoryFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSubCategoryFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingCategory(prev => (prev ? { ...prev, [name]: value } : null));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.match('image.*')) {
                setError('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            const previewUrl = URL.createObjectURL(file);

            if (isEditing && editingCategory) {
                setEditingCategory({
                    ...editingCategory,
                    image: previewUrl,
                    imageFile: file
                });
            } else if (selectedCategory) {
                setSubCategoryFormData({
                    ...subCategoryFormData,
                    imagePreview: previewUrl,
                    image: ''
                });
            } else {
                setCategoryFormData({
                    ...categoryFormData,
                    imagePreview: previewUrl,
                    image: ''
                });
            }

            const filename = await handleImageUpload(file);
            if (filename) {
                if (isEditing && editingCategory) {
                    setEditingCategory({
                        ...editingCategory,
                        image: filename,
                        imageFile: undefined
                    });
                    URL.revokeObjectURL(previewUrl);
                } else if (selectedCategory) {
                    setSubCategoryFormData({
                        ...subCategoryFormData,
                        image: filename,
                        imagePreview: ''
                    });
                    URL.revokeObjectURL(previewUrl);
                } else {
                    setCategoryFormData({
                        ...categoryFormData,
                        image: filename,
                        imagePreview: ''
                    });
                    URL.revokeObjectURL(previewUrl);
                }
            }
        }
    };

    const startEditing = (category: Category) => {
        setEditingCategory({ ...category });
        setSelectedCategory(null);
    };

    const mainCategories = categories.filter(cat => !cat.parent);
    const subCategories = categories.filter(cat => cat.parent);

    const renderImageUpload = (
        currentImage: string,
        previewImage: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        isEditing: boolean = false
    ) => (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Category Image
            </label>
            {currentImage || previewImage ? (
                <div className="flex items-center gap-4">
                    <img
                        src={previewImage || currentImage}
                        alt="Category preview"
                        className="h-16 w-16 object-cover rounded"
                    />
                    <div className="flex gap-2">
                        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">
                            Change
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onChange}
                                disabled={uploading}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                if (isEditing && editingCategory) {
                                    setEditingCategory({
                                        ...editingCategory,
                                        image: '',
                                        imageFile: undefined
                                    });
                                } else if (selectedCategory) {
                                    setSubCategoryFormData({
                                        ...subCategoryFormData,
                                        image: '',
                                        imagePreview: ''
                                    });
                                } else {
                                    setCategoryFormData({
                                        ...categoryFormData,
                                        image: '',
                                        imagePreview: ''
                                    });
                                }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded p-4 hover:border-blue-500">
                    <div className="text-gray-500 mb-2">
                        {uploading ? 'Uploading...' : 'Click to upload image'}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onChange}
                        disabled={uploading}
                        required={!isEditing}
                    />
                </label>
            )}
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Category Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="float-right font-bold"
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {/* Main Category Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            {editingCategory ? 'Edit Category' : 'Add Main Category'}
                        </h2>

                        {editingCategory ? (
                            <form onSubmit={handleUpdateCategory}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        Category Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={editingCategory.name}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>

                                {renderImageUpload(
                                    editingCategory.image,
                                    editingCategory.imageFile ? URL.createObjectURL(editingCategory.imageFile) : '',
                                    (e) => handleImageChange(e, true),
                                    true
                                )}

                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                        type="submit"
                                        disabled={uploading}
                                    >
                                        Update Category
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={() => setEditingCategory(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
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

                                {renderImageUpload(
                                    categoryFormData.image,
                                    categoryFormData.imagePreview,
                                    handleImageChange
                                )}

                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                    type="submit"
                                    disabled={uploading || !categoryFormData.image}
                                >
                                    Add Category
                                </button>
                            </form>
                        )}
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

                                {renderImageUpload(
                                    subCategoryFormData.image,
                                    subCategoryFormData.imagePreview,
                                    handleImageChange
                                )}

                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                        type="submit"
                                        disabled={uploading || !subCategoryFormData.image}
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
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2 text-gray-700">Main Categories</h3>
                                    <ul className="space-y-2">
                                        {mainCategories.map(category => (
                                            <li
                                                key={category.id}
                                                className={`p-3 rounded ${selectedCategory?.id === category.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div
                                                        className="cursor-pointer flex-grow flex items-center gap-3"
                                                        onClick={() => setSelectedCategory(category)}
                                                    >
                                                        {category.image && (
                                                            <img
                                                                src={`https://api.bestbuyelectronics.lk${category.image}`}
                                                                alt={category.name}
                                                                className="h-10 w-10 object-cover rounded"
                                                            />
                                                        )}
                                                        <span>{category.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                                            {subCategories.filter(sub => sub.parent === category.id).length} sub
                                                        </span>
                                                        <button
                                                            onClick={() => startEditing(category)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedCategory && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-medium text-gray-700">
                                                Subcategories of {selectedCategory.name}
                                            </h3>
                                            <button
                                                onClick={() => setSelectedCategory(null)}
                                                className="text-gray-500 hover:text-gray-700 text-sm"
                                            >
                                                Close
                                            </button>
                                        </div>
                                        <ul className="space-y-2 pl-4">
                                            {subCategories
                                                .filter(sub => sub.parent === selectedCategory.id)
                                                .map(subCategory => (
                                                    <li key={subCategory.id} className="p-2 rounded hover:bg-gray-50 flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            {subCategory.image && (
                                                                <img
                                                                    src={`https://api.bestbuyelectronics.lk${subCategory.image}`}
                                                                    alt={subCategory.name}
                                                                    className="h-8 w-8 object-cover rounded"
                                                                />
                                                            )}
                                                            <span>{subCategory.name}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditing(subCategory)}
                                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCategory(subCategory.id)}
                                                                className="text-red-500 hover:text-red-700 text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
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
