import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { FiUpload, FiTrash2, FiImage, FiEdit2 } from 'react-icons/fi';

type ImageUploadProps = {
    onImageUpload: (file: File) => void;
    initialImageUrl?: string;
    maxSizeMB?: number;
    allowedTypes?: string[];
    aspectRatio?: number; // New prop for controlling aspect ratio
};

export default function ImageUpload({
                                        onImageUpload,
                                        initialImageUrl = '',
                                        maxSizeMB = 5,
                                        allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
                                        aspectRatio = 16 / 9, // Default to 16:9 aspect ratio
                                    }: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string>(initialImageUrl);
    const [error, setError] = useState<string>('');
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError('');

        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            setError(`Only ${allowedTypes.join(', ')} files are allowed.`);
            return;
        }

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB.`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Pass file to parent component
        onImageUpload(file);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className='flex justify-center '>
            <div className="space-y-4 w-1/4 mt-32">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={allowedTypes.join(',')}
                    className="hidden"
                />

                {previewUrl ? (
                    <div
                        className="relative rounded-lg overflow-hidden shadow-md transition-all duration-200"
                        style={{ aspectRatio }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleClick}
                    >
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        {(isHovered || error) && (
                            <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center space-x-3 transition-all duration-200">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClick();
                                    }}
                                    className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center"
                                    title="Change image"
                                >
                                    <FiEdit2 className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center"
                                    title="Remove image"
                                >
                                    <FiTrash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        onClick={handleClick}
                        className={`w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                            error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }`}
                        style={{ aspectRatio }}
                    >
                        <div className="text-center p-6">
                            <div className="mx-auto flex items-center justify-center bg-blue-100 rounded-full w-16 h-16 mb-4">
                                <FiImage className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-gray-700 font-medium mb-1">
                                Drag and drop or <span className="text-blue-600">browse files</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                {allowedTypes.join(', ')} (max {maxSizeMB}MB)
                            </p>
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>
                    </div>
                )}

                {error && !previewUrl && (
                    <div className="flex items-center text-red-500 text-sm p-3 bg-red-50 rounded-lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
