import { useState, useEffect } from 'react';

type ImageItem = {
    id: string;
    url: string;
    name: string;
    uploadedAt: string;
};

export default function ImageGallery({
                                         images,
                                         onDelete,
                                         onSelect
                                     }: {
    images: ImageItem[];
    onDelete: (id: string) => void;
    onSelect?: (image: ImageItem) => void;
}) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (images.length > 0 && !selectedImage) {
            setSelectedImage(images[0].id);
        }
    }, [images, selectedImage]);

    const handleImageClick = (image: ImageItem) => {
        setSelectedImage(image.id);
        if (onSelect) {
            onSelect(image);
        }
    };

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg">
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <p className="mt-2 text-gray-600">No images uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedImage === image.id ? 'border-blue-500' : 'border-transparent'
                        }`}
                        onClick={() => handleImageClick(image)}
                    >
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(image.id);
                                }}
                                className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Image</h3>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <img
                            src={images.find(img => img.id === selectedImage)?.url || ''}
                            alt="Selected"
                            className="max-h-64 mx-auto"
                        />
                        <div className="mt-4 text-sm text-gray-600">
                            <p>Name: {images.find(img => img.id === selectedImage)?.name}</p>
                            <p>Uploaded: {images.find(img => img.id === selectedImage)?.uploadedAt}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
