import Image from 'next/image';
import { ReactNode } from 'react';

interface CategoryCardProps {
    imageSrc: string;
    title: string;
}

const CategoryCard = ({ imageSrc, title }: CategoryCardProps) => {
    return (
        <div className="flex flex-col items-center p-4 rounded-full my-10">
            <div className="w-16 h-16 md:h-32 md:w-32 flex items-center justify-center rounded-full border border-gray-200  hover:border-b-red-600">
                <Image
                    src={imageSrc}
                    alt={title}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                />
            </div>
            <p className="mt-2 text-xs md:text-sm font-semibold text-gray-700">{title}</p>
        </div>
    );
};

export default CategoryCard;
