"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/libs/network";

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

interface Brand {
    id: string;
    name: string;
    image?: string;
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
        name: "",
        image: "",
        imagePreview: "",
        parent: "",
    });
    const [uploading, setUploading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // Brand states
    const [brandSelectedCategory, setBrandSelectedCategory] = useState<Category | undefined>(undefined);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [brandIdToEdit, setBrandIdToEdit] = useState<string | null>(null);

    // New states for better management
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCategoryForBrands, setSelectedCategoryForBrands] = useState<Category | null>(null);
    const [showBrandForm, setShowBrandForm] = useState(false);

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

    useEffect(() => {
        if (selectedCategoryForBrands) {
            fetchBrands(selectedCategoryForBrands.id);
            setBrandName("");
            setBrandIdToEdit(null);
        } else {
            setBrands([]);
        }
    }, [selectedCategoryForBrands]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = (await apiClient.get("categories/v2/")) as Category[];
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load categories");
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return null;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("image_name", `category_${Date.now()}`);
            formData.append("type", "categories");

            const response = (await apiClient.post("upload/", formData)) as UploadResponse;
            setUploading(false);
            return response.filename;
        } catch (err) {
            setUploading(false);
            setError(err instanceof Error ? err.message : "Image upload failed");
            return null;
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post("categories/", {
                name: categoryFormData.name,
                image: categoryFormData.image,
                parent: categoryFormData.parent || null,
            });
            setCategoryFormData({ name: "", image: "", imagePreview: "", parent: "" });
            setShowAddForm(false);
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add category");
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.put(`categories/?id=${editingCategory?.id}`, {
                id: editingCategory?.id,
                name: editingCategory?.name,
                image: editingCategory?.image,
                parent: editingCategory?.parent,
            });
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update category");
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (window.confirm("Are you sure you want to delete this category and all its subcategories?")) {
            try {
                await apiClient.delete(`categories/?id=${categoryId}`, {id: categoryId});
                fetchCategories();
                if (editingCategory?.id === categoryId) {
                    setEditingCategory(null);
                }
                if (selectedCategoryForBrands?.id === categoryId) {
                    setSelectedCategoryForBrands(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete category");
            }
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategoryFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingCategory((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.match("image.*")) {
                setError("Please select an image file (JPEG, PNG, etc.)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }

            const previewUrl = URL.createObjectURL(file);

            if (isEditing && editingCategory) {
                setEditingCategory({
                    ...editingCategory,
                    image: previewUrl,
                    imageFile: file,
                });
            } else {
                setCategoryFormData({
                    ...categoryFormData,
                    imagePreview: previewUrl,
                    image: "",
                });
            }

            const filename = await handleImageUpload(file);
            if (filename) {
                if (isEditing && editingCategory) {
                    setEditingCategory({
                        ...editingCategory,
                        image: filename,
                        imageFile: undefined,
                    });
                    URL.revokeObjectURL(previewUrl);
                } else {
                    setCategoryFormData({
                        ...categoryFormData,
                        image: filename,
                        imagePreview: "",
                    });
                    URL.revokeObjectURL(previewUrl);
                }
            }
        }
    };

    const startEditing = (category: Category) => {
        const parentCategory = category.parent ? categories.find((cat) => cat.id === category.parent) : null;

        setEditingCategory({
            ...category,
            parentName: parentCategory?.name || "None",
        });
        setShowAddForm(false);
    };

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const selectCategoryForBrands = (category: Category) => {
        setSelectedCategoryForBrands(category);
        setShowBrandForm(false);
        setBrandIdToEdit(null);
        setBrandName("");
    };

    const renderImageUpload = (
        currentImage: string,
        previewImage: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        isEditing: boolean = false
    ) => (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Category Image</label>
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
                                        image: "",
                                        imageFile: undefined,
                                    });
                                } else {
                                    setCategoryFormData({
                                        ...categoryFormData,
                                        image: "",
                                        imagePreview: "",
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
                    <div className="text-gray-500 mb-2">{uploading ? "Uploading..." : "Click to upload image"}</div>
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
        const flattenCategories = (cats: Category[], level = 0): { id: string; name: string; level: number }[] => {
            return cats.reduce((acc, cat) => {
                acc.push({ id: cat.id, name: "- ".repeat(level) + cat.name, level });
                if (cat.subcategories && cat.subcategories.length > 0) {
                    acc.push(...flattenCategories(cat.subcategories, level + 1));
                }
                return acc;
            }, [] as { id: string; name: string; level: number }[]);
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
                    value={currentParent || ""}
                    onChange={editingCategory ? handleEditChange : handleCategoryChange}
                >
                    <option value="">None (Top Level Category)</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id} disabled={editingCategory && option.id === editingCategory.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                    {currentParent ?
                        "This will create a subcategory under the selected parent category." :
                        "Leave empty to create a top-level category, or select a parent to create a subcategory."
                    }
                </p>
            </div>
        );
    };

    const renderCategoryTree = (categories: Category[], level = 0) => {
        return categories.map((category) => (
            <div key={category.id} className={`ml-${level * 4}`}>
                <div className={`p-3 rounded border ${level > 0 ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300"} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleExpand(category.id)}>
                                {category.subcategories && category.subcategories.length > 0 ? (
                                    <span className="text-gray-500 text-lg">{expandedCategories[category.id] ? "▼" : "►"}</span>
                                ) : (
                                    <span className="w-6"></span>
                                )}
                                {level > 0 && (
                                    <span className="text-gray-400 text-sm">└─</span>
                                )}
                                {category.image && (
                                    <img
                                        src={`https://api.bestbuyelectronics.lk${category.image}`}
                                        alt={category.name}
                                        className="h-10 w-10 object-cover rounded"
                                    />
                                )}
                                <span className={`font-medium ${level > 0 ? 'text-gray-700' : 'text-gray-800'}`}>
                                    {category.name}
                                </span>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                        {category.subcategories.length} subcategories
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectCategoryForBrands(category);
                                }}
                                className="text-green-600 hover:text-green-800 text-sm font-medium bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                                title="Manage Brands"
                            >
                                Brands
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategoryFormData({ name: "", image: "", imagePreview: "", parent: category.id });
                                    setShowAddForm(true);
                                }}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md transition-colors"
                                title="Add Subcategory"
                            >
                                + Sub
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEditing(category);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                                title="Edit Category"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category.id);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm font-medium bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                                title="Delete Category"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                {expandedCategories[category.id] && category.subcategories && category.subcategories.length > 0 && (
                    <div className="border-l-2 border-gray-200 pl-4 mt-2">{renderCategoryTree(category.subcategories, level + 1)}</div>
                )}
            </div>
        ));
    };

    // Brand methods
    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryForBrands) return;
        try {
            if (brandIdToEdit) {
                await apiClient.put(`categories/brand-details/${brandIdToEdit}/`, { name: brandName });
            } else {
                await apiClient.post(`categories/${selectedCategoryForBrands.id}/brands/`, { name: brandName });
            }
            setBrandName("");
            setBrandIdToEdit(null);
            fetchBrands(selectedCategoryForBrands.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save brand");
        }
    };

    const fetchBrands = async (categoryId: string) => {
        setLoadingBrands(true);
        try {
            const data = (await apiClient.get(`categories/${categoryId}/brands/`)) as Brand[];
            setBrands(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load brands");
        }
        setLoadingBrands(false);
    };

    const handleBrandEdit = (brand: Brand) => {
        setBrandIdToEdit(brand.id);
        setBrandName(brand.name);
        setShowBrandForm(true);
    };

    const handleDeleteBrand = async (brandId: string) => {
        if (!window.confirm("Are you sure you want to delete this brand?")) return;
        try {
            await apiClient.delete(`categories/brand-details/${brandId}/`);
            if (selectedCategoryForBrands) fetchBrands(selectedCategoryForBrands.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete brand");
        }
    };

    const resetForms = () => {
        setCategoryFormData({ name: "", image: "", imagePreview: "", parent: "" });
        setEditingCategory(null);
        setShowAddForm(false);
        setSelectedCategoryForBrands(null);
        setBrandName("");
        setBrandIdToEdit(null);
        setShowBrandForm(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            resetForms();
                            setShowAddForm(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        + Add Category
                    </button>
                    <button
                        onClick={resetForms}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-blue-800 font-semibold mb-2">How to create categories and subcategories:</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Top-level category:</strong> Click "Add Category" and leave "Parent Category" as "None"</li>
                    <li>• <strong>Subcategory:</strong> Click "Add Category" and select a parent category, or use the "+ Sub" button on any existing category</li>
                    <li>• <strong>Quick subcategory:</strong> Click the purple "+ Sub" button on any category to immediately start adding a subcategory</li>
                </ul>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button onClick={() => setError(null)} className="float-right font-bold">
                        &times;
                    </button>
                </div>
            )}

            <div className="space-y-8">
                {/* Add/Edit Category Form */}
                {(showAddForm || editingCategory) && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">
                                    {editingCategory ? `Edit Category` : "Add New Category"}
                                </h2>
                                {!editingCategory && categoryFormData.parent && (
                                    <p className="text-sm text-blue-600 mt-1">
                                        Adding subcategory to: {categories.find(cat => cat.id === categoryFormData.parent)?.name}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={resetForms}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
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
                                        placeholder="Enter category name"
                                    />
                                </div>

                                {renderParentSelect(editingCategory ? editingCategory.parent : categoryFormData.parent)}
                            </div>

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
                                    {uploading ? "Uploading..." : editingCategory ? "Update Category" : "Add Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Category List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Categories</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>No categories found.</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="text-blue-500 hover:text-blue-700 mt-2"
                            >
                                Add your first category
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">{renderCategoryTree(categories.filter((cat) => !cat.parent))}</div>
                    )}
                </div>

                {/* Brand Management */}
                {selectedCategoryForBrands && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Brands for: {selectedCategoryForBrands.name}
                            </h2>
                            <button
                                onClick={() => setSelectedCategoryForBrands(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Brand Form */}
                        {(showBrandForm || brands.length === 0) && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <form onSubmit={handleAddBrand}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brandName">
                                            Brand Name
                                        </label>
                                        <input
                                            id="brandName"
                                            type="text"
                                            name="brandName"
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                            required
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter brand name"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                                        >
                                            {brandIdToEdit ? "Update Brand" : "Add Brand"}
                                        </button>
                                        {brandIdToEdit && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setBrandIdToEdit(null);
                                                    setBrandName("");
                                                    setShowBrandForm(false);
                                                }}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Add Brand Button */}
                        {!showBrandForm && brands.length > 0 && (
                            <button
                                onClick={() => setShowBrandForm(true)}
                                className="mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full transition-colors"
                            >
                                + Add New Brand
                            </button>
                        )}

                        {/* Brand Table */}
                        {loadingBrands ? (
                            <div className="text-center text-gray-500 py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                Loading brands...
                            </div>
                        ) : brands.length > 0 ? (
                            <div className="space-y-2">
                                {brands.map((brand) => (
                                    <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="font-medium text-gray-800">{brand.name}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                                onClick={() => handleBrandEdit(brand)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                onClick={() => handleDeleteBrand(brand.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No brands added yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;
