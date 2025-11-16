'use client'
import React, { useState } from 'react';
import { apiClient } from '@/../src/libs/network';
import { FiUpload } from 'react-icons/fi';

interface Banner {
    image: string;
    end_date: string;
    link?: string;
    type?: string;
}

interface UploadResponse {
    filename: string;
    status?: string;
}

interface AddBannerProps {
    onBannerAdded?: () => void;
}

const AddBanner = ({ onBannerAdded }: AddBannerProps) => {
    const [formData, setFormData] = useState<Banner>({
        image: '',
        end_date: '',
        link: '',
        type: 'banner'
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        // Validate image
        if (!file.type.match('image.*')) {
            setError('Please select an image file (JPEG, PNG)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError('Image size should be less than 5MB');
            return;
        }

        // Preview image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image using upload/ endpoint like categories
        try {
            setUploading(true);
            setError(null);

            const formPayload = new FormData();
            formPayload.append("file", file);
            formPayload.append("image_name", `banner_${Date.now()}`);
            formPayload.append("type", "banners");

            const response: UploadResponse = await apiClient.post("upload/", formPayload);

            setFormData(prev => ({
                ...prev,
                image: response.filename
            }));

        } catch (err) {
            setError('Failed to upload image. Please try again.');
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image) {
            setError('Please upload an image');
            return;
        }

        if (!formData.end_date) {
            setError('Please select an end date');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Prepare payload matching API structure
            const payload: any = {
                image: formData.image,
                end_date: formData.end_date,
                type: formData.type || 'banner'
            };

            // Only include link if provided
            if (formData.link) {
                payload.link = formData.link;
            }

            await apiClient.post('offers/banners/', payload);

            setSuccess(true);
            setFormData({
                image: '',
                end_date: '',
                link: '',
                type: 'banner'
            });
            setImagePreview(null);

            // Refresh table
            onBannerAdded?.();

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add banner');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Add New Banner</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Banner added successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                        Banner Image*
                    </label>
                    {imagePreview ? (
                        <div className="mb-4 relative">
                            <img
                                src={imagePreview}
                                alt="Banner preview"
                                className=" h-48 object-contain border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setFormData(prev => ({ ...prev, image: '' }));
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-2/4">
                            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                                </div>
                                <input
                                    id="image"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loading || uploading}
                                />
                            </label>
                        </div>
                    )}
                </div>

                <div className='flex gap-3 '>
                    <div className="mb-4 flex-1">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="link">
                            Link URL
                        </label>
                        <input
                            className=" px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            id="link"
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            disabled={loading || uploading}
                        />
                    </div>

                    <div className="mb-4 flex-1">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="end_date">
                            End Date*
                        </label>
                        <input
                            className=" px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            id="end_date"
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                            disabled={loading || uploading}
                        />
                    </div>

                    <div className="mb-4 flex-1">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="type">
                            Type*
                        </label>
                        <select
                            className=" px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            disabled={loading || uploading}
                        >
                            <option value="banner">Banner</option>
                            <option value="popup">Popup</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={loading || uploading || !formData.image || !formData.end_date}
                >
                    {loading || uploading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {uploading ? 'Uploading...' : 'Adding...'}
                        </span>
                    ) : 'Add Banner'}
                </button>
            </form>
        </div>
    );
};

export default AddBanner;
