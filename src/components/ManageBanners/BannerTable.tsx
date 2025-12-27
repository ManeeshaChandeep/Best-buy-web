'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/../src/libs/network';
import { FiUpload } from 'react-icons/fi';

interface Banner {
    id: number;
    image: string;
    end_date: string;
    link?: string;
    type?: string;
    is_active?: boolean;
    created_at?: string;
}

interface UploadResponse {
    filename: string;
    status?: string;
}

interface BannerTableProps {
    refreshTrigger?: number;
}

const BannerTable = ({ refreshTrigger }: BannerTableProps) => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [uploading, setUploading] = useState(false);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    // Fetch banners
    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let endpoint = 'offers/banners/';
            if (typeFilter !== 'all') {
                endpoint += `?type=${typeFilter}`;
            }

            const data: Banner[] = await apiClient.get(endpoint);
            setBanners(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load banners');
        } finally {
            setLoading(false);
        }
    }, [typeFilter]);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners, refreshTrigger]);

    // Close action menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            setLoading(true);
            // API expects JSON body with id
            await apiClient.delete('offers/banners/', { id });
            setBanners(banners.filter(banner => banner.id !== id));
            setActiveActionMenu(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete banner');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to extract just the filename from image path
    const extractImageFilename = (imagePath: string): string => {
        if (!imagePath) return '';
        
        // If it's already just a filename (no slashes), return as is
        if (!imagePath.includes('/')) return imagePath;
        
        // Extract filename from path (handles /media/banners/filename.png or media/banners/filename.png)
        const parts = imagePath.split('/');
        return parts[parts.length - 1];
    };

    const handleEdit = (banner: Banner) => {
        // Extract just the filename from the image path when editing
        const bannerWithCleanImage = {
            ...banner,
            image: extractImageFilename(banner.image)
        };
        setEditingBanner(bannerWithCleanImage);
        setActiveActionMenu(null);
    };

    const handleCancelEdit = () => {
        setEditingBanner(null);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, banner: Banner) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        // Validate image
        if (!file.type.match('image.*')) {
            setError('Please select an image file (JPEG, PNG)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const formPayload = new FormData();
            formPayload.append("file", file);
            formPayload.append("image_name", `banner_${Date.now()}`);
            formPayload.append("type", "banners");

            const response: UploadResponse = await apiClient.post("upload/", formPayload);

            setEditingBanner(prev => prev ? {
                ...prev,
                image: response.filename
            } : null);

        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner) return;

        try {
            setLoading(true);
            setError(null);

            // Prepare payload - only include fields that are provided
            const payload: any = {
                id: editingBanner.id
            };

            // Extract just the filename from image path before sending
            if (editingBanner.image) {
                payload.image = extractImageFilename(editingBanner.image);
            }
            if (editingBanner.end_date) payload.end_date = editingBanner.end_date;
            if (editingBanner.link !== undefined) payload.link = editingBanner.link;
            if (editingBanner.type) payload.type = editingBanner.type;

            await apiClient.put('offers/banners/', payload);

            setEditingBanner(null);
            fetchBanners();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update banner');
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingBanner(prev => prev ? {
            ...prev,
            [name]: value
        } : null);
    };

    const toggleActionMenu = (id: number) => {
        setActiveActionMenu(activeActionMenu === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;

        if (imagePath.startsWith('/media')) {
            const cleaned = imagePath.replace(/^\/+/, '');
            return `https://api.bestbuyelectronics.lk/${cleaned}`;
        }

        const cleaned = imagePath.replace(/^\/+/, '');
        return `https://api.bestbuyelectronics.lk/media/banners/${cleaned}`;
    };

    if (loading && banners.length === 0 && !editingBanner) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="m-4 p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Banners</h2>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="banner">Banner</option>
                        <option value="popup">Popup</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                    <button onClick={() => setError(null)} className="float-right font-bold">×</button>
                </div>
            )}

            {/* Edit Form */}
            {editingBanner && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Edit Banner</h3>
                        <button
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                    </div>
                    <form onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Image</label>
                                {editingBanner.image ? (
                                    <div className="mb-2">
                                        <img
                                            src={getImageUrl(editingBanner.image)}
                                            alt="Banner preview"
                                            className="h-32 w-full object-contain border rounded"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                // Prevent infinite loop by checking if already showing placeholder
                                                if (!target.src.includes('placeholder-banner.png')) {
                                                    target.src = '/placeholder-banner.png';
                                                }
                                            }}
                                        />
                                    </div>
                                ) : null}
                                <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded p-2 hover:border-blue-500">
                                    <FiUpload className="w-6 h-6 mb-2 text-gray-500" />
                                    <span className="text-sm text-gray-500">Change Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, editingBanner)}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Link URL</label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={editingBanner.link || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">End Date*</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={editingBanner.end_date}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Type*</label>
                                    <select
                                        name="type"
                                        value={editingBanner.type || 'banner'}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="banner">Banner</option>
                                        <option value="popup">Popup</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                disabled={loading || uploading}
                            >
                                {loading ? 'Updating...' : 'Update Banner'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Image
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Link URL
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                End Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {banners.length > 0 ? (
                            banners.map(banner => (
                                <tr key={banner.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={getImageUrl(banner.image)}
                                            alt="Banner"
                                            className="h-16 w-32 object-cover rounded"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                // Prevent infinite loop by checking if already showing placeholder
                                                if (!target.src.includes('placeholder-banner.png')) {
                                                    target.src = '/placeholder-banner.png';
                                                    target.classList.add('bg-gray-100');
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${banner.type === 'popup' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {banner.type || 'banner'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {banner.link ? (
                                            <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {banner.link.length > 30 ? `${banner.link.substring(0, 30)}...` : banner.link}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(banner.end_date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${new Date(banner.end_date) > new Date() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {new Date(banner.end_date) > new Date() ? 'Active' : 'Expired'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(banner.created_at || '')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                                        <button
                                            onClick={() => toggleActionMenu(banner.id)}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            disabled={loading}
                                        >
                                            Actions
                                        </button>

                                        {activeActionMenu === banner.id && (
                                            <div
                                                ref={actionMenuRef}
                                                className="absolute right-11 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                            >
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => handleEdit(banner)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                                        disabled={loading}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(banner.id)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No banners found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BannerTable;
