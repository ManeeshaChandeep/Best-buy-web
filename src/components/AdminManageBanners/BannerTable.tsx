'use client'
import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/../src/libs/network';

interface Banner {
    id: number;
    image: string;
    end_date: string;
    link_url: string;
    is_active: boolean;
    created_at: string;
}

const BannerTable = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    // Fetch banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                setError(null);

                const data: Banner[] = await apiClient.get('offers/banners/');
                setBanners(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load banners');
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

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
            await apiClient.delete(`offers/banners/${id}/`);
            setBanners(banners.filter(banner => banner.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete banner');
        } finally {
            setLoading(false);
            setActiveActionMenu(null);
        }
    };

    const toggleActionMenu = (id: number) => {
        setActiveActionMenu(activeActionMenu === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading && banners.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold">Error loading banners:</p>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="m-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Banners</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
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
                                        src={`https://api.bestbuyelectronics.lk${banner.image}`}
                                        alt="Banner"
                                        className="h-16 w-32 object-cover rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder-banner.png';
                                            (e.target as HTMLImageElement).classList.add('bg-gray-100');
                                        }}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {banner.link_url || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(banner.end_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {banner.is_active ? 'Active' : 'Expired'}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(banner.created_at)}
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
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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
