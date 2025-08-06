import { useState, useEffect } from 'react';
import { apiClient } from '@/libs/network';

interface Category {
    id: string;
    name: string;
    image: string;
    parent?: string | null;
    subcategories?: Category[];
}

interface EditingCategory extends Category {
    imageFile?: File;
    parentName?: string;
}

interface UploadResponse {
    filename: string;
    status?: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        image: '',
        imagePreview: '',
        parent: ''
    });
    const [brandName, setBrandName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [brandSelectedCategory, setBrandSelectedCategory] = useState<Category>();

    useEffect(() => {
        fetchCategories();

        return () => {
            if (categoryFormData.imagePreview) {
                URL.revokeObjectURL(categoryFormData.imagePreview);
            }
            if (editingCategory?.imageFile) {
                URL.revokeObjectURL(URL.createObjectURL(editingCategory.imageFile));
            }
        };
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = (await apiClient.get('categories/v2/')) as Category[];
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
                image: categoryFormData.image,
                parent: categoryFormData.parent || null
            });
            setCategoryFormData({ name: '', image: '', imagePreview: '', parent: '' });
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add category');
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.put(`categories/?id=${editingCategory?.id}`, {
                id: editingCategory?.id,
                name: editingCategory?.name,
                image: editingCategory?.image,
                parent: editingCategory?.parent
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
                await apiClient.delete(`categories/?id=${categoryId}`);
                fetchCategories();
                if (editingCategory?.id === categoryId) {
                    setEditingCategory(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete category');
            }
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategoryFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        const parentCategory = category.parent
            ? categories.find(cat => cat.id === category.parent)
            : null;

        setEditingCategory({
            ...category,
            parentName: parentCategory?.name || 'None'
        });
    };

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

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

    const renderParentSelect = (currentParent: string | null | undefined) => {
        const flattenCategories = (cats: Category[], level = 0): {id: string, name: string, level: number}[] => {
            return cats.reduce((acc, cat) => {
                acc.push({id: cat.id, name: '- '.repeat(level) + cat.name, level});
                if (cat.subcategories && cat.subcategories.length > 0) {
                    acc.push(...flattenCategories(cat.subcategories, level + 1));
                }
                return acc;
            }, [] as {id: string, name: string, level: number}[]);
        };

        const options = flattenCategories(categories);

        return (
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parent">
                    Parent Category
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="parent"
                    name="parent"
                    value={currentParent || ''}
                    onChange={editingCategory ? handleEditChange : handleCategoryChange}
                >
                    <option value="">None (Top Level)</option>
                    {options.map(option => (
                        <option
                            key={option.id}
                            value={option.id}
                            disabled={editingCategory && option.id === editingCategory.id}
                        >
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const renderCategoryTree = (categories: Category[], level = 0) => {
        return categories.map(category => (
            <div key={category.id} className="ml-4">
                <div
                    className={`p-2 rounded flex items-center justify-between ${level > 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleExpand(category.id)}
                    >
                        {category.subcategories && category.subcategories.length > 0 ? (
                            <span className="text-gray-500">
                                {expandedCategories[category.id] ? '▼' : '►'}
                            </span>
                        ) : (
                            <span className="w-4"></span>
                        )}
                        {category.image && (
                            <img
                                src={`https://api.bestbuyelectronics.lk${category.image}`}
                                alt={category.name}
                                className="h-8 w-8 object-cover rounded"
                            />
                        )}
                        <span>{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log(category)
                                setBrandSelectedCategory(category)
                            }}
                            className="text-green-500 hover:text-green-700 text-sm"
                        >
                            Add Brand
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                startEditing(category);
                            }}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {expandedCategories[category.id] && category.subcategories && category.subcategories.length > 0 && (
                    <div className="border-l-2 border-gray-200 pl-2">
                        {renderCategoryTree(category.subcategories, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    const handleAddBrand = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder: integrate with your backend here
        console.log('Brand Submitted:', brandName);
        apiClient.post(`categories/${brandSelectedCategory.id}/brands/`,{name:brandName})
        // setBrandName('');
        // setBrandSelectedCategory(null)
    };

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
                    {/* Add/Edit Category Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            {editingCategory ? `Edit Category (${editingCategory.parentName || 'Top Level'})` : 'Add Category'}
                        </h2>

                        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Category Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={editingCategory ? editingCategory.name : categoryFormData.name}
                                    onChange={editingCategory ? handleEditChange : handleCategoryChange}
                                    required
                                />
                            </div>

                            {renderParentSelect(editingCategory ? editingCategory.parent : categoryFormData.parent)}

                            {renderImageUpload(
                                editingCategory ? editingCategory.image : categoryFormData.image,
                                editingCategory?.imageFile ? URL.createObjectURL(editingCategory.imageFile) : categoryFormData.imagePreview,
                                (e) => handleImageChange(e, !!editingCategory),
                                !!editingCategory
                            )}

                            <div className="flex gap-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                    type="submit"
                                    disabled={uploading || (!editingCategory && !categoryFormData.image)}
                                >
                                    {editingCategory ? 'Update Category' : 'Add Category'}
                                </button>
                                {editingCategory && (
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={() => setEditingCategory(null)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Add Brand Form */}
                    <div className={`${!brandSelectedCategory ? "hidden" : "" } bg-white p-6 rounded-lg shadow-md`}>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Brand</h2>

                        <form onSubmit={handleAddBrand}>
                            {/* Category Label with Name (no input) */}
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm font-bold mb-2">
                                    Category: {brandSelectedCategory?.name} {/* Replace with actual category name */}
                                </label>
                            </div>

                            {/* Brand Name Input */}
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="brand"
                                >
                                    Brand Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="brand"
                                    type="text"
                                    name="brand"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Add Brand
                            </button>
                        </form>
                    </div>


                </div>

                    {/* Category List */}
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Categories</h2>

                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {renderCategoryTree(categories.filter(cat => !cat.parent))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;
